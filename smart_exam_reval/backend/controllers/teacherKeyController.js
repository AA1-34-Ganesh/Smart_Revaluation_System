const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const { embeddingQueue } = require('../utils/queues');

exports.uploadAnswerKey = async (req, res) => {
    // 1. Check if file exists
    if (!req.file) {
        return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const { subjectCode } = req.body;
    const teacherId = req.user.id; // From middleware
    const filePath = req.file.path; // Local path from Multer

    try {
        console.log(` [API] Uploading Answer Key for ${subjectCode}...`);

        // 2. Insert into Database (Schema: teacher_id, subject_code, file_url, status)
        // Status starts as 'pending' so the worker can pick it up
        const result = await pool.query(
            `INSERT INTO answer_keys (teacher_id, subject_code, file_url, status) 
             VALUES ($1, $2, $3, 'pending') 
             RETURNING id`,
            [teacherId, subjectCode, filePath]
        );
        const keyId = result.rows[0].id;

        // 3. Add to Worker Queue for Text Extraction
        await embeddingQueue.add('process-key', {
            keyId,
            filePath
        });

        console.log(` [API] Answer Key uploaded. Job added to queue. Key ID: ${keyId}`);

        res.json({
            success: true,
            message: "Answer Key uploaded. Processing started in background.",
            keyId: keyId
        });

    } catch (error) {
        console.error(" [API] Upload Failed:", error);
        res.status(500).json({ error: "Failed to process upload: " + error.message });
    }
};

exports.getKeys = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const result = await pool.query(
            "SELECT * FROM answer_keys WHERE teacher_id = $1 ORDER BY created_at DESC",
            [teacherId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getKeyFile = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user.id;

        // 1. Fetch Key Record
        const result = await pool.query(
            "SELECT file_url, subject_code FROM answer_keys WHERE id = $1 AND teacher_id = $2",
            [id, teacherId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Answer Key not found or unauthorized" });
        }

        const { file_url, subject_code } = result.rows[0];

        // 2. Check if file exists
        if (!file_url || !fs.existsSync(file_url)) {
            return res.status(404).json({ error: "File not found on server" });
        }

        // 3. Serve File
        // Extract extension to set correct content type (usually .pdf)
        const ext = path.extname(file_url);
        const filename = `${subject_code}_AnswerKey${ext}`;

        res.download(file_url, filename, (err) => {
            if (err) {
                console.error("File Download Error:", err);
                if (!res.headersSent) {
                    res.status(500).json({ error: "Failed to download file" });
                }
            }
        });

    } catch (err) {
        console.error("Get Key File Error:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.deleteKey = async (req, res) => {
    try {
        const { id } = req.params;
        const teacherId = req.user.id;

        // 1. Get file path before deleting (to clean up storage)
        const keyResult = await pool.query(
            "SELECT file_url FROM answer_keys WHERE id = $1 AND teacher_id = $2",
            [id, teacherId]
        );

        if (keyResult.rows.length === 0) {
            return res.status(404).json({ error: "Answer Key not found or unauthorized" });
        }

        const filePath = keyResult.rows[0].file_url;

        // 2. Delete from DB
        await pool.query("DELETE FROM answer_keys WHERE id = $1 AND teacher_id = $2", [id, teacherId]);

        // 3. Delete from Disk (Optional but recommended)
        if (filePath && fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log(` Deleted file: ${filePath}`);
            } catch (fsErr) {
                console.error("Failed to delete file from disk:", fsErr);
            }
        }

        res.json({ message: "Answer Key deleted successfully" });
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Failed to delete key" });
    }
};
