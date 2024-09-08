const express = require("express");
const router = express.Router();
const ClassController = require("../controllers/classController");

// Class routes
router.post("/create", ClassController.createClass);
router.post("/get", ClassController.getClassByKey); // Use query parameters for classKey
router.post("/by-teacher", ClassController.getClassesByTeacherId); // Use query parameters for teacherId
router.delete("/delete", ClassController.deleteClassById);

module.exports = router;
