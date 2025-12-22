const router = require("express").Router();
const publicController = require("../controllers/publicController");
const security = require("../middleware/security");

// GET /api/public/status/:applicationId
// Unprotected Route, but Rate Limited
router.get(
    "/status/:applicationId",
    security.publicStatusLimiter, // Max 5 requests/min per IP
    security.validateApplicationId, // UUID regex check
    publicController.getPublicStatus
);

module.exports = router;
