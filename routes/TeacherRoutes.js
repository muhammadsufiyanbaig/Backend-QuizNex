const express = require("express");
const { updateTeacherInfo, deleteTeacherProfile, signupTeacher, loginTeacher, getTeacher } = require("../controllers/TeacherController");
const authenticate = require("../middleware/authMiddleware");
const { logout } = require("../controllers/TeacherController");
const router = express.Router();

router.post("/signup", signupTeacher);
router.post("/login", loginTeacher);
router.post("/portal", authenticate, getTeacher);
router.get("/logout", logout);
router.put("/update", authenticate, updateTeacherInfo);
router.delete("/delete", authenticate, deleteTeacherProfile);

module.exports = router;