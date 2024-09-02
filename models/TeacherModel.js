const { sql } = require('../utils/db');

async function createTeacherTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS teacher (
      id SERIAL PRIMARY KEY,
      fullName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `;
}

async function findTeacherByEmail(email) {
  return sql`SELECT * FROM teacher WHERE email = ${email}`;
}

async function findTeacherById(id) {
  return sql`SELECT * FROM teacher WHERE id = ${id}`;
}

async function insertTeacher(fullName, email, hashedPassword) {
  return sql`
    INSERT INTO teacher (fullName, email, password) VALUES (${fullName}, ${email}, ${hashedPassword})
  `;
}

async function updateTeacher(id, fullName, email, password) {
  return sql`
    UPDATE teacher
    SET fullName = ${fullName}, email = ${email}, password = ${password}
    WHERE id = ${id}
  `;
}

async function deleteTeacher(id) {
  return sql`
    DELETE FROM teacher WHERE id = ${id}
  `;
}

module.exports = {
  createTeacherTable,
  findTeacherByEmail,
  findTeacherById,
  insertTeacher,
  updateTeacher,
  deleteTeacher,
};
