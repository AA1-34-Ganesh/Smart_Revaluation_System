const xss = require("xss");
const rateLimit = require("express-rate-limit");

/**
 * Sanitize all string inputs in req.body to prevent XSS attacks.
 * This should be applied globally.
 */
exports.sanitizeInputs = (req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === "string") {
                req.body[key] = xss(req.body[key]);
            }
        }
    }
    next();
};

/**
 * Rate Limiter for Public Status Checks.
 * Allows 5 requests per minute per IP to prevent scraping student data.
 */
exports.publicStatusLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        status: "error",
        message: "Too many status checks. Please try again in a minute."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Validates that 'applicationId' is a valid UUIDv4.
 * Middleware to stop SQL/NoSQL injection attempts on public routes.
 */
exports.validateApplicationId = (req, res, next) => {
    const { applicationId } = req.params;

    // Regex for UUID v4
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (!applicationId || !uuidRegex.test(applicationId)) {
        return res.status(400).json({
            status: "error",
            message: "Invalid Application ID format."
        });
    }

    next();
};
