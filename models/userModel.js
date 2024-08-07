const { sql } = require('../utils/db');

async function createUserTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      fullName TEXT,
      email TEXT UNIQUE,
      password TEXT
    )
  `;
}

async function findUserByEmail(email) {
  return sql`SELECT * FROM users WHERE email = ${email}`;
}
async function findUserById(id) {
  return sql`SELECT * FROM faculty WHERE id = ${id}`;
}

async function insertUser(fullName, email, hashedPassword) {
  return sql`
    INSERT INTO users (fullName, email, password) VALUES (${fullName}, ${email}, ${hashedPassword})
  `;
}

module.exports = {
  createUserTable,
  findUserByEmail,
  insertUser,
  findUserById,
};
