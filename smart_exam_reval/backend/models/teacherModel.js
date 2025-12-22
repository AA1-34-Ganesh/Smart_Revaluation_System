const pool = require("../config/db");

exports.getTeacherByUserId = async (userId) => {
  // FIX: Select directly from 'users' table where role is teacher
  // We alias 'id' as 'user_id' so your controller logic keeps working
  const query = `
    SELECT id, id AS user_id, department, subject_specialization 
    FROM users 
    WHERE id=$1 AND role='teacher' 
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

exports.createTeacher = async (userId, department) => {
  // FIX: Update the existing user row instead of inserting into a missing 'teachers' table
  const query = `
    UPDATE users 
    SET department = $2
    WHERE id = $1
    RETURNING id, id AS user_id, department
  `;
  const { rows } = await pool.query(query, [userId, department]);
  return rows[0];
};

exports.getRequestsByTeacher = async (teacherId, specialization, department) => {
  // FIX: 
  // 1. Use LEFT JOIN for marks because 'subject_id' might be null for manually added subjects
  // 2. Fallback to r.subject_code if m.subject_code is missing
  // 3. Dynamic Matching: Match by teacher_id OR (unassigned AND subject specialization match AND department match)

  const query = `
    SELECT 
      r.id AS request_id, 
      r.student_id, 
      COALESCE(m.subject_name, r.subject_code) as subject_name, -- Fallback name
      COALESCE(m.subject_code, r.subject_code) as subject_code, -- Fallback code
      r.status, 
      r.payment_status, 
      r.ai_feedback,
      r.teacher_notes,
      r.created_at, 
      u.reg_no, 
      u.full_name AS name,
      u.email
    FROM revaluation_requests r
    LEFT JOIN marks m ON r.subject_id = m.id   -- <--- Changed to LEFT JOIN
    JOIN users u ON r.student_id = u.id
    WHERE 
      r.status != 'draft'
      AND (
        r.teacher_id = $1
        OR (
             r.teacher_id IS NULL
             AND $2::text IS NOT NULL 
             AND (
               m.subject_code ILIKE $2 
               OR m.subject_name ILIKE $2
               OR r.subject_code ILIKE $2
             )
             -- Optional: Department Check (Ensure student belongs to same dept as teacher)
             AND ($3::text IS NULL OR u.department ILIKE $3)
        )
      )
    ORDER BY r.created_at DESC;
  `;
  const { rows } = await pool.query(query, [teacherId, specialization || null, department || null]);
  return rows;
};