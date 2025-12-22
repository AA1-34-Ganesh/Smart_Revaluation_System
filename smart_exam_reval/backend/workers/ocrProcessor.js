const { Worker } = require("bullmq");
const tesseract = require("tesseract.js");
const pool = require("../config/db");
const { gradingQueue } = require("../utils/queues");
const { redisConfig } = require("../config/redis");

const ocrWorker = new Worker(
    "ocr-queue",
    async (job) => {
        console.log(`[OCR Job ${job.id}] Processing Request #${job.data.requestId}`);
        const { requestId, filePath, files, fileUrls } = job.data;

        try {
            await pool.query("UPDATE revaluation_requests SET status = 'PROCESSING' WHERE id = $1", [requestId]);

            // ✅ Handle both fileUrls (array of strings) and files (array of objects)
            let filesToProcess = [];
            
            if (fileUrls && Array.isArray(fileUrls)) {
                // New format: array of URL strings like ['/uploads/file.jpg']
                filesToProcess = fileUrls.map(url => ({
                    path: url.startsWith('/') ? url.substring(1) : url // Remove leading /
                }));
            } else if (files && Array.isArray(files)) {
                // Old format: array of objects with path property
                filesToProcess = files;
            } else if (filePath) {
                // Legacy: single file path
                filesToProcess = [{ path: filePath }];
            }
            
            console.log(` Files to process:`, filesToProcess.map(f => f.path));
            
            if (filesToProcess.length === 0) throw new Error("No files to process");

            let fullText = "";

            for (let i = 0; i < filesToProcess.length; i++) {
                const file = filesToProcess[i];
                console.log(`   -> OCR Page ${i + 1}`);
                const { data: { text } } = await tesseract.recognize(file.path, "eng");
                fullText += `--- Page ${i + 1} ---\n${text}\n`;
            }

            // Save & Trigger Grading
            await pool.query(
                "UPDATE revaluation_requests SET ocr_data = $1, status = 'PROCESSING', updated_at = NOW() WHERE id = $2",
                [fullText, requestId]
            );

            await gradingQueue.add("grade-request", { requestId });
            console.log(` [OCR Job ${job.id}] AI Grading Triggered.`);

            return { charCount: fullText.length };

        } catch (error) {
            console.error(` [OCR Job ${job.id}] Failed:`, error.message);
            await pool.query("UPDATE revaluation_requests SET status = 'failed' WHERE id = $1", [requestId]);
            throw error;
        }
    },
    { connection: redisConfig }
);

module.exports = ocrWorker;