const nodemailer = require('nodemailer');
const path = require('path'); // For resolving the image path
const fs = require('fs'); // To read the logo file

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

/**
 * Send OTP Email with a styled template and local logo
 * @param {string} email - Recipient's email address
 * @param {number} otp - OTP to send
 */
async function sendOtpEmail(email, otp) {
  // Resolve the path to your logo
  const logoPath = path.resolve(__dirname, '../logo.png'); // Adjust 'logo.png' to your actual logo file name
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your OTP for QuizNex',
    html: `
      <div style="background-color: #f3f4f6; padding: 20px; font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background: #10b981; padding: 20px; text-align: center;">
            <img src="data:image/png;base64,${logoBase64}" alt="QuizNex Logo" style="max-width: 100px; margin-bottom: 10px;" />
            <h1 style="color: white; font-size: 24px; margin: 0;">QuizNex</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #10b981;">Hello!</h2>
            <p style="font-size: 16px; line-height: 1.5;">Thank you for using QuizNex. Your One-Time Password (OTP) is:</p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #10b981;">${otp}</span>
            </div>
            <p style="font-size: 16px; line-height: 1.5;">This OTP is valid for the next 10 minutes. Please do not share this code with anyone.</p>
            <p style="font-size: 14px; color: #555; margin-top: 20px;">If you did not request this, please ignore this email or contact support.</p>
          </div>
          <div style="background: #10b981; color: white; text-align: center; padding: 10px; font-size: 14px;">
            <p style="margin: 0;">&copy; 2024 QuizNex. All rights reserved.</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
  } catch (error) {
    console.error('Error sending OTP email:', error.message);
    throw new Error('Failed to send OTP email.');
  }
}

module.exports = { sendOtpEmail };
