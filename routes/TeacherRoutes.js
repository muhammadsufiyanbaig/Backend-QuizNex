const express = require("express");
const { signupTeacher, loginTeacher, getTeacher } = require("../controllers/TeacherController");
const authenticate = require("../middleware/authMiddleware");
const { logout } = require("../controllers/TeacherController");
const router = express.Router();

router.post("/signup", signupTeacher);
router.post("/login", loginTeacher);
router.post("/portal", authenticate, getTeacher);
router.get("/logout", logout);

module.exports = router;