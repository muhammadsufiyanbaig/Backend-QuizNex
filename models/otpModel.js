const { sql } = require('../utils/db');

async function createOtpsTable() {
  await sql` CREATE TABLE IF NOT EXISTS otps (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL
)`;
}

const OTP_EXPIRATION_TIME = 1 * 60 * 1000; 
async function generateAndStoreOTP(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expirationTime = new Date(Date.now() + OTP_EXPIRATION_TIME).toISOString();

  try {
    await sql`
      INSERT INTO otps (email, otp, expires_at)
      VALUES (${email}, ${otp}, ${expirationTime});
    `;
    return otp;
  } catch (error) {
    console.error("Error generating OTP:", error);
    throw error;
  }
}

// Function to verify OTP
async function verifyOTP(email, otp) {
  try {
    const result = await sql`
      SELECT * FROM otps
      WHERE email = ${email} AND otp = ${otp} AND expires_at > NOW();
    `;

    if (result.length > 0) {
      await sql`
        DELETE FROM otps
        WHERE email = ${email};
      `;
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
}

module.exports = {
  createOtpsTable,
  generateAndStoreOTP,
  verifyOTP,
};
