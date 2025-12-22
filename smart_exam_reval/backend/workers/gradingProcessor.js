const { Worker } = require("bullmq");
const { redisConfig } = require("../config/redis");
const pool = require("../config/db");
const { generateGrading } = require("../utils/aiService");

const gradingProcessor = async (job) => {
    console.log(`[Grading Job ${job.id}] Starting AI Evaluation...`);
    const { requestId } = job.data;

    try {
        // 1. Fetch Student OCR Data
        const reqRes = await pool.query(
            `SELECT r.id, r.ocr_data, m.subject_code, m.subject_name 
             FROM revaluation_requests r 
             JOIN marks m ON r.subject_id = m.id 
             WHERE r.id = $1`,
            [requestId]
        );
        const request = reqRes.rows[0];

        if (!request || !request.ocr_data) {
            throw new Error(`No OCR data available for Request #${requestId}`);
        }

        // 2. Fetch the Answer Key
        // We get the most recent 'completed' key for this subject
        const keyRes = await pool.query(
            `SELECT extracted_text FROM answer_keys 
             WHERE subject_code = $1 AND status = 'completed'
             ORDER BY created_at DESC LIMIT 1`,
            [request.subject_code]
        );
        const answerKey = keyRes.rows[0];

        if (!answerKey) {
            console.warn(` [Grading Job ${job.id}] No Answer Key found for ${request.subject_code}. Skipping AI.`);
            return;
        }

        // --- Data Sanitization for files/images ---
        // Prefer job.data.files, fallback to job.data.images, else []
        let files = [];
        if (Array.isArray(job.data.files)) {
            files = job.data.files;
        } else if (job.data.files) {
            files = [job.data.files];
        } else if (Array.isArray(job.data.images)) {
            files = job.data.images;
        } else if (job.data.images) {
            files = [job.data.images];
        }

        // 3. Construct Prompt (Prompt Sandwiching Strategy)
        const systemInstruction = `
        You are a strict academic examiner. Your task is to grade a student's answer sheet by comparing it strictly against the official answer key.
        
        RULES:
        1. Ignore spelling/grammar unless it alters the meaning.
        2. Award marks based on conceptual understanding matching the key.
        3. If the student answer is irrelevant or empty, score 0.
        4. Provide a "Gap Analysis" of missing points.
        `;

        const prompt = `
        SUBJECT: ${request.subject_name} (${request.subject_code})

        =========== OFFICIAL ANSWER KEY ===========
        ${answerKey.extracted_text}
        ===========================================

        =========== STUDENT ANSWER SCRIPT (OCR) ===========
        ${request.ocr_data}
        ===================================================

        Evaluate the student answer against the key.
        Return this exact JSON structure:
        {
            "score": <integer 0-100>,
            "feedback": "<concise summary string>",
            "gap_analysis": {
                "strong_points": ["<point 1>", "<point 2>"],
                "missing_points": ["<point 1>", "<point 2>"]
            }
        }
        `;

        // 4. Execute AI
        console.log(` [Grading Job ${job.id}] Sending to Gemini 2.0 Flash Lite...`);

        // generateGrading now returns a parsed Object, so we don't need JSON.parse here
        // Pass files as the second argument for future compatibility
        const aiResult = await generateGrading(systemInstruction, prompt, files);

        console.log(`[Grading Job ${job.id}] Graded. Score: ${aiResult.score}`);

        // 5. Update Database
        await pool.query(
            `UPDATE revaluation_requests 
             SET ai_feedback = $1, status = 'TEACHER_REVIEW', updated_at = NOW() 
             WHERE id = $2`,
            [aiResult, requestId]
        );

        return aiResult;

    } catch (error) {
        console.error(` [Grading Job ${job.id}] Failed:`, error.message);
        await pool.query("UPDATE revaluation_requests SET status = 'failed' WHERE id = $1", [requestId]);
        throw error;
    }
};

const gradingWorker = new Worker("grading-queue", gradingProcessor, { connection: redisConfig });

module.exports = { gradingWorker, gradingProcessor };