// routes/teacherProfileRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { protect, teacherOnly } = require("../middleware/auth");
const userModel = require("../models/userModel");

// Route to get teacher profile
router.get("/profile", protect, teacherOnly, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get teacher basic info from users table
    const teacherProfile = await userModel.findById(userId);

    if (!teacherProfile) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(teacherProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Route to UPDATE teacher profile
router.put("/profile", protect, teacherOnly, async (req, res) => {
  try {
    const userId = req.user.id;
    const { full_name, department, subject_specialization } = req.body;

    // Validate input
    if (!full_name || full_name.trim().length < 2) {
      return res.status(400).json({ message: "Full name is required (min 2 chars)" });
    }

    // Update user record
    const result = await pool.query(
      `UPDATE users 
       SET full_name = $1, department = $2, subject_specialization = $3, updated_at = NOW()
       WHERE id = $4 AND role = 'teacher'
       RETURNING *`,
      [full_name.trim(), department || null, subject_specialization || null, userId]
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
