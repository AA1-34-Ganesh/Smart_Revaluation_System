const router = require("express").Router();
const authController = require("../controllers/authController");
const { validate } = require("../middleware/validate");
const { registerSchema, loginSchema } = require("../validation/authValidation");

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/validate-role", authController.validateRole);

module.exports = router;
