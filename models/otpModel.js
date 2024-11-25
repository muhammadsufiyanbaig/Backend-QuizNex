const { sql } = require('../utils/db');

async function createOtp(email, otp) {
  return sql`INSERT INTO otp (email, otp) VALUES (${email}, ${otp})`;
}

async function verifyOtp(email, otp) {
  return sql`SELECT * FROM otp WHERE email = ${email} AND otp = ${otp}`;
}

async function deleteOtp(email) {
  return sql`DELETE FROM otp WHERE email = ${email}`;
}

module.exports = {
  createOtp,
  verifyOtp,
  deleteOtp,
};
