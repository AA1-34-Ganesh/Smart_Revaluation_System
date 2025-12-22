const { Queue } = require("bullmq");
const { redisConfig } = require("../config/redis");

// Define queues with the specific Redis config
// These names MUST match what is in your worker files
const gradingQueue = new Queue("grading-queue", { connection: redisConfig });
const embeddingQueue = new Queue("embedding-queue", { connection: redisConfig });
const ocrQueue = new Queue("ocr-queue", { connection: redisConfig });

module.exports = {
    gradingQueue,
    embeddingQueue,
    ocrQueue
};