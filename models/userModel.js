const { sql } = require('../utils/db');

async function createUser(name, email, username, hashedPassword, phoneNumber, type) {
  return sql`INSERT INTO Users (name, email, username, password, phoneNumber, type)
             VALUES (${name}, ${email}, ${username}, ${hashedPassword}, ${phoneNumber}, ${type})`;
}

async function getUserByEmail(email) {
  return sql`SELECT * FROM users WHERE email = ${email}`;
}

async function getUserByUsername(username) {
  return sql`SELECT * FROM users WHERE username = ${username}`;
}

async function updateUser(email, updates) {
  return sql`UPDATE users
             SET name = ${updates.name}, username = ${updates.username}
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
