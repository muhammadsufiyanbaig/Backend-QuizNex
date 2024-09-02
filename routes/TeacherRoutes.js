const express = require("express");
const router = express.Router();
const TeacherController = require("../controllers/TeacherController");

// Teacher routes
router.post("/signup", TeacherController.signupTeacher);
router.post("/login", TeacherController.loginTeacher);
router.post("/get", TeacherController.getTeacher); // Changed from /portal to /get
router.post("/logout", TeacherController.logout);
router.put("/update", TeacherController.updateTeacherInfo);
router.delete("/delete", TeacherController.deleteTeacherProfile);

module.exports = router;
