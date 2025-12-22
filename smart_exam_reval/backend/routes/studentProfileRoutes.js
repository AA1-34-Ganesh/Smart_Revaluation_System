// routes/studentProfileRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { protect, studentOnly } = require("../middleware/auth");
const userModel = require("../models/userModel");
const studentModel = require("../models/studentModel");

// Route to get student profile
router.get("/profile", protect, studentOnly, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get student basic info from users table
    const studentProfile = await userModel.findById(userId);

    if (!studentProfile) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get marks for the student
    const marks = await studentModel.getStudentMarks(userId);

    // Combine profile and marks
    const response = {
      ...studentProfile,
      marks: marks
    };

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to UPDATE student profile
router.put("/profile", protect, studentOnly, async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, department, reg_no } = req.body;

    // Validate input
    if (!full_name || full_name.trim().length < 2) {
      return res.status(400).json({ message: "Full name is required (min 2 chars)" });
    }

    // Update user record
    const result = await pool.query(
      `UPDATE users 
       SET full_name = $1, department = $2, reg_no = $3, updated_at = NOW()
       WHERE id = $4 AND role = 'student'
       RETURNING *`,
      [full_name.trim(), department || null, reg_no || null, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Profile not found or not authorized" });
    }

    res.json({ message: "Profile updated successfully", user: result.rows[0] });
  } catch (err) {
    console.error("Profile Update Error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

module.exports = router;
