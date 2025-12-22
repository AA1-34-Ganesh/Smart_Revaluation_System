const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Custom Rate Limiter for Free Tier (Safety Buffer)
const MIN_DELAY_MS = 7000;
let lastRequestTime = 0;

async function enforceRateLimit() {
    const now = Date.now();
    const elapsed = now - lastRequestTime;

    if (elapsed < MIN_DELAY_MS) {
        const waitTime = MIN_DELAY_MS - elapsed;
        console.log(` [AI Service] Rate limiting: Waiting ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    lastRequestTime = Date.now();
}

/**
 * Grades student answer sheet using Gemini Vision
 * @param {string} answerKeyText - Extracted text from answer key PDF
 * @param {string} subjectName - Subject name
 * @param {Array} images - Array of image objects with base64 data
 * @returns {Promise<Object>} - Parsed JSON response with score and feedback
 */
async function generateGrading(answerKeyText, subjectName, images, retryCount = 0) {
    await enforceRateLimit();

    const modelsToTry = [
        "gemini-2.5-flash-lite",
        "gemini-1.5-flash",
        "gemini-1.5-pro"
    ];

    // Pick model based on retry count (simple fallback strategy)
    // If retryCount > available models, loop back or stick to last
    const modelName = modelsToTry[retryCount % modelsToTry.length];

    console.log(` Using AI Model: ${modelName} (Attempt ${retryCount + 1})`);

    const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.3,
        }
    });

    try {
        const systemInstruction = `You are a strict, fair university examiner grading ${subjectName} exam papers.

TASK: Compare the student's handwritten answer sheet (images provided) with the official answer key.

GRADING CRITERIA:
1. Extract all text, diagrams, formulas, and drawings from student's answer sheet
2. Compare against the official answer key point-by-point
3. Award marks based on:
   - Correctness of concepts
   - Completeness of answer
   - Quality of diagrams/illustrations
   - Proper use of terminology
4. Deduct marks for:
   - Missing key points
   - Incorrect concepts
   - Incomplete diagrams
5. Ignore minor spelling errors unless they change meaning

OUTPUT FORMAT (strict JSON):
{
  "score": <number 0-100>,
  "feedback": "<detailed evaluation>",
  "gap_analysis": {
    "strong_points": ["point 1", "point 2", ...],
    "weak_points": ["missing 1", "incorrect 2", ...]
  }
}`;

        const prompt = `
SUBJECT: ${subjectName}

=== OFFICIAL ANSWER KEY ===
${answerKeyText}

=== STUDENT'S ANSWER SHEET ===
The images below show the student's handwritten answers. Carefully analyze all text, diagrams, formulas, and illustrations.

Grade the student's work by comparing it against the answer key above. Provide a score out of 100 and detailed feedback.`;

        // Construct content parts: text + images
        const contentParts = [
            { text: systemInstruction },
            { text: prompt },
            ...images // Images in format: {inlineData: {data: base64, mimeType: 'image/jpeg'}}
        ];

        const result = await model.generateContent(contentParts);
        const response = await result.response;
        const text = response.text();

        try {
            return JSON.parse(text);
        } catch (e) {
            console.error(" [AI Service] Invalid JSON response:", text);
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        }

    } catch (error) {
        // Handle Overloaded (503) or Rate Limiting (429)
        const isOverloaded = error.message.includes("503") || error.message.includes("overloaded");
        const isRateLimited = error.response && error.response.status === 429;

        if (isOverloaded || isRateLimited) {
            if (retryCount < 5) { // Max 5 retries
                const delay = 5000 * (retryCount + 1); // Linear backoff: 5s, 10s, 15s...
                console.warn(` [AI Service] Model ${modelName} failed (${isOverloaded ? 'Overloaded' : 'Rate Limited'}). Retrying in ${delay}ms with fallback model...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return generateGrading(answerKeyText, subjectName, images, retryCount + 1);
            }
        }

        console.error(" [AI Service] Generation Failed:", error);
        throw new Error(`AI Service Failure (${modelName}): ` + error.message);
    }
}

module.exports = { generateGrading };