const pool = require("../config/db");

exports.addMark = async ({ student_id, subject_name, subject_code, score, grade, status }) => {
  const query = `
    INSERT INTO marks (student_id, subject_name, subject_code, score, grade, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *;
  `;
  const values = [student_id, subject_name, subject_code, score, grade, status];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.getMarksByStudent = async (studentId) => {
  const query = `SELECT * FROM marks WHERE student_id=$1`;
  const { rows } = await pool.query(query, [studentId]);
  return rows;
};