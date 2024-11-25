const nodemailer = require("nodemailer");
const { generateAndStoreOTP, verifyOTP } = require("../models/otpModel");

// Function to generate custom HTML for the OTP email
const generateOTPHtml = (otp) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #f9f9f9;
        }
        .header {
          text-align: center;
          margin-bottom: 20px;
        }
        .otp {
          font-size: 24px;
          font-weight: bold;
          margin: 20px 0;
          color: #007BFF;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h2>Your OTP Code</h2>
        </div>
        <p>Your OTP code is:</p>
        <div class="otp">${otp}</div>
        <p>Please use this code to verify your email. Do not share it with anyone. It is valid for a limited time.</p>
        <div class="footer">
          <p>QuizNex Team</p>
        </div>
      </div>
    </body>
  </html>
`;

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendOTP(email) {
  const otp = await generateAndStoreOTP(email); // Generate and store OTP
  const subject = "Your OTP Code";
  const htmlContent = generateOTPHtml(otp); // Generate custom HTML for the email

  try {
    // Send the email using Nodemailer
    await transporter.sendMail({
      from: `"QuizNex OTP" <${process.env.SMTP_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    });

    return { success: true, otp };
  } catch (error) {
    console.error("Error sending OTP:", error);
    return { success: false, error: "Failed to send OTP" };
  }
}

exports.requestOTP = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const result = await sendOTP(email);

  if (result.success) {
    res.status(200).json({ message: "OTP sent successfully", success: true });
  } else {
    res.status(500).json({ error: result.error });
  }
};

exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  const isValid = await verifyOTP(email, otp);

  if (isValid) {
    res.status(200).json({ message: "OTP verified successfully", success: true });
  } else {
    res.status(400).json({ error: "Invalid or expired OTP" });
  }
};
