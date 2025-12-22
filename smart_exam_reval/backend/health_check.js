const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function quickHealthCheck() {
  console.log('\n ReValuate System Health Check\n');
  console.log('=' .repeat(60));

  try {
    // 1. Check Database Connection
    console.log('\n  Database Connection...');
    await pool.query('SELECT NOW()');
    console.log('    Connected to PostgreSQL');

    // 2. Check for Orphaned Requests
    console.log('\n   Checking for Orphaned Records...');
    const orphanedRequests = await pool.query(`
      SELECT COUNT(*) as count
      FROM revaluation_requests r
      LEFT JOIN users u ON r.student_id = u.id
      LEFT JOIN marks m ON r.subject_id = m.id
      WHERE u.id IS NULL OR m.id IS NULL
    `);
    const orphanCount = parseInt(orphanedRequests.rows[0].count);
    if (orphanCount > 0) {
      console.log(`    Found ${orphanCount} orphaned requests`);
      console.log('    Run: GET /api/teacher/check-data-integrity for details');
    } else {
      console.log('    No orphaned records found');
    }

    // 3. Count Active Requests
    console.log('\n   Active Requests Summary...');
    const requestStats = await pool.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM revaluation_requests
      GROUP BY status
      ORDER BY count DESC
    `);
    if (requestStats.rows.length > 0) {
      requestStats.rows.forEach(row => {
        console.log(`   ${row.status}: ${row.count}`);
      });
    } else {
      console.log('     No requests in system');
    }

    // 4. Check for Unassigned Requests
    console.log('\n  Unassigned Requests...');
    const unassigned = await pool.query(`
      SELECT COUNT(*) as count
      FROM revaluation_requests
      WHERE teacher_id IS NULL AND UPPER(status::text) != 'DRAFT'
    `);
    const unassignedCount = parseInt(unassigned.rows[0].count);
    if (unassignedCount > 0) {
      console.log(`   ${unassignedCount} requests waiting for teacher assignment`);
      
      // Show subjects
      const subjects = await pool.query(`
        SELECT DISTINCT m.subject_code, m.subject_name
        FROM revaluation_requests r
        LEFT JOIN marks m ON r.subject_id = m.id
        WHERE r.teacher_id IS NULL AND UPPER(r.status::text) != 'DRAFT'
        LIMIT 5
      `);
      console.log('   Subjects:');
      subjects.rows.forEach(s => {
        console.log(`      - ${s.subject_code || 'N/A'}: ${s.subject_name || 'Unknown'}`);
      });
    } else {
      console.log('    All requests assigned');
    }

    // 5. Teacher Specializations
    console.log('\n  Available Teachers...');
    const teachers = await pool.query(`
      SELECT full_name, subject_specialization, department
      FROM users
      WHERE role = 'teacher'
      ORDER BY full_name
      LIMIT 5
    `);
    if (teachers.rows.length > 0) {
      teachers.rows.forEach(t => {
        console.log(`    ${t.full_name} | Spec: ${t.subject_specialization || 'None'} | Dept: ${t.department || 'N/A'}`);
      });
    } else {
      console.log('     No teachers found in system');
    }

    console.log('\n' + '='.repeat(60));
    console.log(' Health Check Complete\n');

  } catch (err) {
    console.error('\n  Health Check Failed:', err.message);
  } finally {
    await pool.end();
  }
}

quickHealthCheck();
