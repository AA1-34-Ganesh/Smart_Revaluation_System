require('dotenv').config(); // 1. Load Environment Variables
const Redis = require("ioredis");

// 2. Parse the connection string from .env
// This assumes your .env has: UPSTASH_REDIS_URL="rediss://default:..."
if (!process.env.REDIS_URL) {
    console.error(" FATAL: UPSTASH_REDIS_URL is missing in .env file");
    process.exit(1);
}

// We use the URL class to extract host/port/password safely
const connectionUrl = new URL(process.env.REDIS_URL);

const redisConnection = {
    host: connectionUrl.hostname,
    port: Number(connectionUrl.port),
    password: connectionUrl.password,
    username: "default",
    tls: { rejectUnauthorized: false }, // Essential for Upstash (SSL)
    maxRetriesPerRequest: null, // Required by BullMQ
    family: 0, // Helps with Node 18+ DNS
    connectTimeout: 30000, 
    keepAlive: 10000,
    retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
    },
    reconnectOnError: (err) => {
        const targetError = "READONLY";
        if (err.message.includes(targetError)) {
            return true;
        }
        return false;
    }
};

console.log(`\n Redis Config: Connecting to ${redisConnection.host}...`);

let redisClient;

try {
    // 3. Create the Main Client
    redisClient = new Redis(redisConnection);

    redisClient.on("connect", () => {
        console.log("Main Redis Client: Connected!");
    });

    redisClient.on("error", (err) => {
        // Ignore the reset errors that happen when connections cycle
        if (err.code !== 'ECONNRESET') {
            console.error(" Redis Client Error:", err.message);
        }
    });

} catch (err) {
    console.error(" Init Failed:", err);
}

// 4. Export 'redisConfig' as the OBJECT (for BullMQ) and client (for general use)
module.exports = {
    redisClient,
    redisConfig: redisConnection
};