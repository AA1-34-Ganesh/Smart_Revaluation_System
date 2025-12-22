const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// Define Admin Routes
router.post('/create-teacher', protect, adminOnly, adminController.createTeacher);

module.exports = router;
