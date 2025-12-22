const router = require("express").Router();
const revalController = require("../controllers/revaluationController");
const { protect, studentOnly } = require("../middleware/auth");
const { validate } = require("../middleware/validate");
const {
    createRevalSchema,
    paymentSchema
} = require("../validation/revaluationValidation");

// 1. Create Request
router.post(
    "/create",
    protect,
    studentOnly,
    validate(createRevalSchema),
    revalController.create
);

// 2. Make Payment
router.post(
    "/payment",
    protect,
    studentOnly,
    validate(paymentSchema),
    revalController.payment
);

// 3. NEW: Get My Requests (Good to have for specific "My Applications" pages)
router.get(
    "/my-requests",
    protect,
    studentOnly,
    revalController.getStudentRequests
);

// 4. NEW: Appeal Result
router.post(
    "/appeal",
    protect,
    studentOnly,
    revalController.appeal
);

// 5. Trigger AI (Called after Supabase Insert)
router.post(
    "/trigger-ai",
    protect,
    studentOnly,
    revalController.triggerAI
);

module.exports = router;