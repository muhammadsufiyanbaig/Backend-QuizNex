const { sql } = require('../utils/db');

async function createTeacherTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS teacher (
      id SERIAL PRIMARY KEY,
      fullName TEXT,
      email TEXT UNIQUE,
      password TEXT
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
    INSERT INTO Teacher (fullName, email, password) VALUES (${fullName}, ${email}, ${hashedPassword})
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
    DELETE FROM teacher
    WHERE id = ${id}
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