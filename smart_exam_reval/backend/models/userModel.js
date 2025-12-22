const pool = require("../config/db");

// 1. Create User (Inserts basic info, returns ID for next steps)
exports.createUser = async ({ full_name, email, password, role }) => {
  const query = `
    INSERT INTO users (full_name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, full_name AS name, email, role, created_at;
  `;
  const values = [full_name, email.toLowerCase(), password, role];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

// 2. Find by Email (Used for Login)
exports.findByEmail = async (email) => {
  const query = `SELECT id, full_name AS name, email, password, role, department FROM users WHERE email=$1 LIMIT 1`;
  const { rows } = await pool.query(query, [email.toLowerCase()]);
  return rows[0];
};

// 3. Find by ID (Used for Profile/Dashboard)
exports.findById = async (id) => {
  const query = `SELECT id, full_name AS name, email, role, department, reg_no FROM users WHERE id=$1`;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};