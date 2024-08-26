const { Resend } = require("resend");
const { generateAndStoreOTP, verifyOTP } = require('../models/otpModel');
const OTPEmail = require("../views/OTPEmail");
const React = require('react');
const ReactDOMServer = require('react-dom/server');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOTP(email) {
  const otp = await generateAndStoreOTP(email);
  const subject = "Your OTP Code";
  const message = `Your OTP code is ${otp}. It is valid for a short period. Please do not share it with anyone.`;

  try {
    const emailHtml = ReactDOMServer.renderToString(
      React.createElement(OTPEmail, { message, otp })
    );
    await resend.emails.send({
      from: "OTP from QuizNex <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      text: message, 
      html: emailHtml, 
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
