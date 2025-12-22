const { Worker } = require("bullmq");
const fs = require("fs");
const pool = require("../config/db");
const { redisConfig } = require("../config/redis");
const pdf = require("pdf-parse"); // Standard import for v1.1.1

const embeddingWorker = new Worker(
    "embedding-queue",
    async (job) => {
        console.log(` [Key Job ${job.id}] Processing Answer Key: ${job.data.filePath}`);
        const { keyId, filePath } = job.data;

        try {
            // 1. Update Status
            await pool.query("UPDATE answer_keys SET status = 'processing' WHERE id = $1", [keyId]);

            // 2. Check File
            if (!fs.existsSync(filePath)) {
                throw new Error("File not found on server.");
            }

            // 3. Read File
            const dataBuffer = fs.readFileSync(filePath);

            // 4. Extract Text
            // pdf-parse v1.1.1 exports a function directly
            let data;
            try {
                data = await pdf(dataBuffer);
            } catch (innerErr) {
                // Fallback: If for some reason it's still imported strangely
                if (typeof pdf.default === 'function') {
                    data = await pdf.default(dataBuffer);
                } else {
                    throw innerErr;
                }
            }

            let extractedText = data.text;

            // 5. Validation
            if (!extractedText || extractedText.trim().length < 50) {
                throw new Error("Extracted text is too short. Ensure the PDF is digital (not a scanned image).");
            }

            // Clean up text (remove excessive newlines and null bytes for Postgres compatibility)
            extractedText = extractedText.replace(/\x00/g, '').replace(/\n\s*\n/g, '\n').replace(/\s+/g, ' ').trim();
            console.log(` Extracted ${extractedText.length} characters.`);

            // 6. Save to DB
            await pool.query(
                `UPDATE answer_keys 
                 SET extracted_text = $1, status = 'completed', updated_at = NOW() 
                 WHERE id = $2`,
                [extractedText, keyId]
            );

            console.log(`[Key Job ${job.id}] Answer Key Ready.`);
            return { length: extractedText.length };

        } catch (error) {
            console.error(`[Key Job ${job.id}] Failed:`, error.message);
            await pool.query(
                "UPDATE answer_keys SET status = 'failed', error_message = $1 WHERE id = $2",
                [error.message, keyId]
            );
            throw error;
        }
    },
    { connection: redisConfig }
);

module.exports = embeddingWorker;