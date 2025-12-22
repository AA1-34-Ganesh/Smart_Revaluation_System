const router = require("express").Router();
const paymentController = require("../controllers/paymentController");
const { protect, studentOnly } = require("../middleware/auth");

router.post("/create-intent", protect, studentOnly, paymentController.createPaymentIntent);
router.post("/confirm", protect, studentOnly, paymentController.confirmPayment);

module.exports = router;