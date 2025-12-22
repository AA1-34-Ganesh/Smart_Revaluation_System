const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Filename: timestamp-originalName
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});

// File Filter (Updated to allow Excel)
const fileFilter = (req, file, cb) => {
    // 1. Add 'xlsx' and 'xls' to the allowed regex
    const allowedTypes = /jpeg|jpg|png|pdf|csv|xlsx|xls/;
    
    // 2. Check the extension
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    
    // 3. lenient Check for Excel/CSV Mimetypes
    // Excel files often have different mimetypes depending on the OS (e.g., application/vnd.openxmlformats...)
    // So we assume if the extension is .xlsx/.xls/.csv, it's valid to avoid "block" errors.
    const isDocument = 
        file.originalname.match(/\.(xlsx|xls|csv)$/i) || 
        allowedTypes.test(file.mimetype);

    if (extname && isDocument) {
        cb(null, true);
    } else {
        cb(new Error("Upload failed: Only Images, PDFs, CSVs, and Excel files are allowed!"));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: fileFilter
});

module.exports = upload;