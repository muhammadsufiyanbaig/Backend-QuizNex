const { Resend } = require('resend');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { validateString, getErrorMessage } = require('../utils/utils');
const ContactFormEmail = require('../views/ContactFormEmail');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendEmail = async (req, res) => {
  const { senderEmail, message } = req.body;

  // Simple server-side validation
  if (!validateString(senderEmail, 500)) {
    return res.status(400).json({ error: 'Invalid sender email' });
  }
  if (!validateString(message, 5000)) {
    return res.status(400).json({ error: 'Invalid message' });
  }

  let data;
  try {
    const emailHtml = ReactDOMServer.renderToString(
      React.createElement(ContactFormEmail, { message, senderEmail })
    );

    data = await resend.emails.send({
      from: 'From Portfolio contact Form <onboarding@resend.dev>',
      to: 'send.sufiyan@gmail.com',
      subject: 'Message from contact form',
      reply_to: senderEmail,
      html: emailHtml,
    });

    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: getErrorMessage(error) });
  }
};
