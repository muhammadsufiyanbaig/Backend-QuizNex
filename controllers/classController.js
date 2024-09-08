const { insertClass, findClassByKey, findClassesByTeacherId, deleteClass } = require("../models/classModel");
const keyGenerator = require("../utils/keyGenerator");

async function createClass(req, res) {
  const { className, teacherId, duration } = req.body;
  const classKey = keyGenerator.generateRandomKey();
  try {
    await insertClass(className, classKey, teacherId, duration);
    res.json({ message: "Class created successfully", classKey });
  } catch (error) {
    console.error("Error creating class:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getClassByKey(req, res) {
  const { classKey } = req.query; 
  
  try {
    const classData = await findClassByKey(classKey);
    if (classData.length === 0) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.json(classData[0]);
  } catch (error) {
    console.error("Error fetching class data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function getClassesByTeacherId(req, res) {
  const { teacherId } = req.body;
  // console.log("Received teacherId:", teacherId); 

  try {
    const classes = await findClassesByTeacherId(teacherId);
    // console.log("Classes found:", classes); 
    res.json(classes);
  } catch (error) {
    console.error("Error fetching classes for teacher:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteClassById(req, res) {
  const { classId } = req.body;
  
  try {
    await deleteClass(classId);
    res.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  createClass,
  getClassByKey,
  getClassesByTeacherId,
  deleteClassById
};
