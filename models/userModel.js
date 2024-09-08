const { sql } = require('../utils/db');


async function createUserTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      fullName TEXT,
      email VARCHAR(255) UNIQUE,
      password TEXT
    )
  `;
}

async function findUserByEmail(email) {
  return sql`SELECT * FROM users WHERE email = ${email}`;
}

async function findUserById(id) {
  return sql`SELECT * FROM users WHERE id = ${id}`;
}

async function insertUser(fullName, email, hashedPassword) {
  return sql`
    INSERT INTO users (fullName, email, password) VALUES (${fullName}, ${email}, ${hashedPassword})
  `;
}

async function updateUserById(id, fullName, email, hashedPassword) {
  return sql`
    UPDATE users 
    SET 
      fullName = ${fullName}, 
      email = ${email}, 
      password = ${hashedPassword}
    WHERE id = ${id}
  `;
}

async function deleteUserById(id) {
  return sql`
    DELETE FROM users 
    WHERE id = ${id}
  `;
}

module.exports = {
  createUserTable,
  findUserByEmail,
  insertUser,
  findUserById,
  updateUserById,
  deleteUserById,
};
