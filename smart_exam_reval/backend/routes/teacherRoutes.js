const router = require("express").Router();
const teacherController = require("../controllers/teacherController");
const { protect, teacherOnly } = require("../middleware/auth");
const multer = require('multer');
const path = require('path');

// --- 1. Multer Configuration ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Ensure this directory exists!
        cb(null, path.join(__dirname, '../uploads/temp/'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'key-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) return cb(null, true);
        cb(new Error('Only image and PDF files are allowed'));
    }
});

// --- 2. Dashboard Routes ---
router.get("/dashboard", protect, teacherOnly, teacherController.getTeacherRequests);
router.put("/request/status", protect, teacherOnly, teacherController.updateStatus);
router.put("/request/reject/:id", protect, teacherOnly, teacherController.rejectRequest);

// --- 3. Answer Key Routes (THESE WERE MISSING) ---
router.get("/keys", protect, teacherOnly, teacherController.getAnswerKeys);

//  FIX: Matches frontend formData.append('file', ...)
router.post("/keys/upload", protect, teacherOnly, upload.single('file'), teacherController.uploadAnswerKey);

router.delete("/keys/:id", protect, teacherOnly, teacherController.deleteAnswerKey);
router.get("/keys/:id/file", protect, teacherOnly, teacherController.getAnswerKeyFile);

// --- 4. Student Script Upload (For manual grading) ---
router.post("/upload-script", protect, teacherOnly, upload.array('scripts', 10), teacherController.uploadAnswerScript);

// --- 5. Debug Tools ---
router.get("/debug-request/:id", teacherController.debugRequest);
router.get("/check-data-integrity", teacherController.checkDataIntegrity);

module.exports = router;
