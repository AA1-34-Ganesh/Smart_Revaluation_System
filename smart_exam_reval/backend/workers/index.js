const path = require("path");
// 1. LOAD DOTENV FIRST (Before importing workers)
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// 2. Debug print to confirm it loaded
console.log(" Worker Process Started");
console.log("   REDIS_URL:", process.env.REDIS_URL ? " Loaded" : " NOT FOUND");

// 3. NOW import the workers (which use config/redis.js)
const ocrWorker = require("./ocrProcessor");
const embeddingWorker = require("./embeddingProcessor");
const gradingWorker = require("./gradingProcessor");

console.log(" AI Exam Workers System Running...");

// Keep process alive
process.on('SIGTERM', async () => {
    await ocrWorker.close();
    await embeddingWorker.close();
    await gradingWorker.close();
    process.exit(0);
});