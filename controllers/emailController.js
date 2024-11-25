const nodemailer = require('nodemailer');
const { validateString, getErrorMessage } = require('../utils/utils');

const generateEmailHtml = (senderName, senderEmail, message) => `
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
        .message {
          margin-top: 20px;
          padding: 10px;
          border-left: 4px solid #007BFF;
          background-color: #eef4ff;
        }
        .footer {
          margin-top: 30px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h2>Message from QuizNex Contact Form</h2>
        </div>
        <p><strong>Name:</strong> ${senderName}</p>
        <p><strong>Email:</strong> ${senderEmail}</p>
        <div class="message">
          <p>${message.replace(/\n/g, '<br>')}</p>
        </div>
        <div class="footer">
          <p>This email was sent via the QuizNex Contact Form.</p>
        </div>
      </div>
    </body>
  </html>
`;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendEmail = async (req, res) => {
  const { senderEmail, message, senderName } = req.body;

  // Simple server-side validation
  if (!validateString(senderEmail, 500)) {
    return res.status(400).json({ error: 'Invalid sender email' });
  }
  if (!validateString(message, 5000)) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  try {
    // Generate custom HTML for the email
    const emailHtml = generateEmailHtml(senderName, senderEmail, message);

    // Send the email using Nodemailer
    const info = await transporter.sendMail({
      from: `"QuizNex Contact Form" <${process.env.SMTP_USER}>`,
      to: 'send.sufiyan@gmail.com',
      subject: 'Message from contact form',
      replyTo: senderEmail,
      html: emailHtml,
    });

    res.json({ info });
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
};
