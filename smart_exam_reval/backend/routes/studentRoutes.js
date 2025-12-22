const router = require("express").Router();
const studentController = require("../controllers/studentController");
const { protect, studentOnly } = require("../middleware/auth");

router.get("/dashboard", protect, studentOnly, studentController.dashboard);
router.post("/add-subject", protect, studentOnly, studentController.addSubject);

module.exports = router;


