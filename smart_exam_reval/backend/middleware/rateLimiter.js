const rateLimit = require("express-rate-limit");

exports.rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: "Too many requests. Please try again later."
});
