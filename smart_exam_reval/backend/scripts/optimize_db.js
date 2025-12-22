const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const optimize = async () => {
    try {
        console.log(" Optimizing Database for Scalability...");

        // --- 1. Users Table Indexes ---
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_reg_no ON users(reg_no);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);`);
        console.log(" Users table indexed.");

        // --- 2. Marks Table Indexes ---
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_marks_student_id ON marks(student_id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_marks_subject_code ON marks(subject_code);`);
        console.log("Marks table indexed.");

        // --- 3. Revaluation Requests Indexes ---
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_requests_student_id ON revaluation_requests(student_id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_requests_teacher_id ON revaluation_requests(teacher_id);`);
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_requests_status ON revaluation_requests(status);`);
        console.log("Revaluation Requests table indexed.");

        // --- 4. Answer Keys Indexes ---
        await pool.query(`CREATE INDEX IF NOT EXISTS idx_keys_subject_code ON answer_keys(subject_code);`);
        console.log(" Answer Keys table indexed.");

        console.log(" Database Optimization Complete! Queries should now be much faster.");
    } catch (err) {
        console.error(" Optimization Failed:", err);
    } finally {
        pool.end();
    }
};

optimize();