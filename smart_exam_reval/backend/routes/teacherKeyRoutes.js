const express = require('express');
const router = express.Router();
const upload = require('../utils/fileUpload'); // Using existing utility instead of raw multer
const { protect, teacherOnly } = require('../middleware/auth');
const teacherKeyController = require('../controllers/teacherKeyController');

// Route: POST /api/teacher/keys/upload
router.post(
    '/keys/upload',
    protect,
    teacherOnly,
    upload.single('file'), // Expects form-data field named 'file'
    teacherKeyController.uploadAnswerKey
);

// Route: GET /api/teacher/keys
router.get('/keys', protect, teacherOnly, teacherKeyController.getKeys);

// Route: GET /api/teacher/keys/:id/file (View PDF)
router.get('/keys/:id/file', protect, teacherOnly, teacherKeyController.getKeyFile);

// Route: DELETE /api/teacher/keys/:id
router.delete('/keys/:id', protect, teacherOnly, teacherKeyController.deleteKey);

module.exports = router;
