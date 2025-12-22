const pool = require("../config/db");

// 1. Get Student Info (From 'users' table)
exports.getStudentByUserId = async (userId) => {
  const query = `
    SELECT id, id AS user_id, reg_no, department 
    FROM users 
    WHERE id=$1 AND role='student' 
    LIMIT 1
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

// 2. Create Student (Updates existing user with Reg No & Dept)
exports.createStudent = async (userId, reg_no, department) => {
  const query = `
    UPDATE users 
    SET reg_no = $2, department = $3
    WHERE id = $1
    RETURNING id, id AS user_id, reg_no, department;
  `;
  const { rows } = await pool.query(query, [userId, reg_no, department]);
  return rows[0];
};

// 3. Get Marks (Linked via student_id = user_id)
exports.getStudentMarks = async (studentId) => {
  const query = `
    SELECT id, subject_name, subject_code, score, grade, status
    FROM marks
    WHERE student_id=$1
    ORDER BY subject_name ASC;
  `;
  const { rows } = await pool.query(query, [studentId]);
  return rows;
};

// 4. Count Failed Subjects
exports.countFailures = async (studentId) => {
  const query = `
    SELECT COUNT(*) AS failed_count
    FROM marks
    WHERE student_id=$1 AND status='Fail';
  `;
  const { rows } = await pool.query(query, [studentId]);
  return parseInt(rows[0].failed_count);
};

// 5. Add New Mark/Subject
exports.addMark = async (studentId, subjectData) => {
  const { name, code, marks, grade, status } = subjectData;

  // First, get student's reg_no from users table
  const userQuery = `SELECT reg_no FROM users WHERE id = $1`;
  const userRes = await pool.query(userQuery, [studentId]);
  const reg_no = userRes.rows[0]?.reg_no || 'N/A';

  const query = `
        INSERT INTO marks (student_id, subject_name, subject_code, score, grade, status, reg_no)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
    `;
  const { rows } = await pool.query(query, [studentId, name, code, marks, grade, status, reg_no]);
  return rows[0];
};
