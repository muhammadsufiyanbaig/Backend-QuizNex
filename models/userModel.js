const { sql } = require('../utils/db');

async function createUser(fullName, email, username, hashedPassword) {
  return sql`INSERT INTO users (fullName, email, username, password)
             VALUES (${fullName}, ${email}, ${username}, ${hashedPassword})`;
}

async function getUserByEmail(email) {
  return sql`SELECT * FROM users WHERE email = ${email}`;
}

async function getUserByUsername(username) {
  return sql`SELECT * FROM users WHERE username = ${username}`;
}

async function updateUser(email, updates) {
  return sql`UPDATE users
             SET fullName = ${updates.fullName}, username = ${updates.username}
             WHERE email = ${email}`;
}

async function deleteUser(email) {
  return sql`DELETE FROM users WHERE email = ${email}`;
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserByUsername,
  updateUser,
  deleteUser,
};
