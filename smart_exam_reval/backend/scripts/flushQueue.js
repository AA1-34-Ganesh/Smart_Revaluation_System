const { Queue } = require('bullmq');
const { redisConfig } = require('../config/redis');

// Create queue instances for all queues
const ocrQueue = new Queue('ocr-queue', { connection: redisConfig });
const gradingQueue = new Queue('grading-queue', { connection: redisConfig });
const embeddingQueue = new Queue('embedding-queue', { connection: redisConfig });

async function clean() {
    try {
        console.log('🧹 Starting queue cleanup...\n');
        
        // Clean OCR Queue
        console.log(' Cleaning ocr-queue...');
        await ocrQueue.drain();
        await ocrQueue.clean(0, 1000, 'failed');
        await ocrQueue.clean(0, 1000, 'completed');
        await ocrQueue.clean(0, 1000, 'wait');
        await ocrQueue.clean(0, 1000, 'active');
        await ocrQueue.clean(0, 1000, 'delayed');
        console.log('    ocr-queue cleaned');
        
        // Clean Grading Queue
        console.log(' Cleaning grading-queue...');
        await gradingQueue.drain();
        await gradingQueue.clean(0, 1000, 'failed');
        await gradingQueue.clean(0, 1000, 'completed');
        await gradingQueue.clean(0, 1000, 'wait');
        await gradingQueue.clean(0, 1000, 'active');
        await gradingQueue.clean(0, 1000, 'delayed');
        console.log('    grading-queue cleaned');
        
        // Clean Embedding Queue
        console.log('Cleaning embedding-queue...');
        await embeddingQueue.drain();
        await embeddingQueue.clean(0, 1000, 'failed');
        await embeddingQueue.clean(0, 1000, 'completed');
        await embeddingQueue.clean(0, 1000, 'wait');
        await embeddingQueue.clean(0, 1000, 'active');
        await embeddingQueue.clean(0, 1000, 'delayed');
        console.log('    embedding-queue cleaned');
        
        console.log('\n All Queues Flushed Successfully!');
        console.log('   - Cleared all pending jobs');
        console.log('   - Cleared all failed jobs');
        console.log('   - Cleared all active jobs');
        console.log('   - Cleared all completed jobs');
        
        // Close connections
        await ocrQueue.close();
        await gradingQueue.close();
        await embeddingQueue.close();
        
        process.exit(0);
    } catch (error) {
        console.error(' Error flushing queue:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

clean();
