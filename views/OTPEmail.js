const React = require('react');

function OTPEmail({ message, otp }) {
  return React.createElement('div', null,
    React.createElement('h1', null, 'OTP from QuizNex'),
    React.createElement('h2', null, React.createElement('strong', null, 'OTP: '), otp),
    React.createElement('h4', null, React.createElement('strong', null, 'Message: '), message)
  );
}

module.exports = OTPEmail;
