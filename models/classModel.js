const { sql } = require('../utils/db');

async function createClassesTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS classes (
      id SERIAL PRIMARY KEY,
      className TEXT NOT NULL,
      classKey TEXT UNIQUE NOT NULL,
      quizDuration TEXT NOT NULL,
      teacherid INT NOT NULL,
      userid INT NOT NULL,
      FOREIGN KEY (teacherid) REFERENCES teachers(id) ON DELETE CASCADE,
      FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
    )
  `;
}

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
  createClassesTable,
  insertClass,
  findClassByKey,
  findClassesByTeacherId,
  deleteClass
};
