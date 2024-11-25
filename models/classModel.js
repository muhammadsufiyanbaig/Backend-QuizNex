const { sql } = require('../utils/db');
// Insert a new class
async function insertClass(className, classKey, teacherId, duration) {
  return sql`
    INSERT INTO classes (className, classKey, teacherid, quizDuration)
    VALUES (${className}, ${classKey}, ${teacherId}, ${duration})
  `;
}


// Find class by its unique key
async function findClassByKey(classKey) {
  return sql`SELECT * FROM classes WHERE classKey = ${classKey}`;
}

// Find all classes by teacherId
async function findClassesByTeacherId(teacherId) {
  return sql`SELECT * FROM classes WHERE teacherid = ${teacherId}`;
}

// Delete a class by ID
async function deleteClass(classId) {
  return sql`DELETE FROM classes WHERE id = ${classId}`;
}

module.exports = {
  insertClass,
  findClassByKey,
  findClassesByTeacherId,
  deleteClass
};
