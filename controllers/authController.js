const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail, getUserByUsername, updateUser, deleteUser } = require('../models/userModel');
const { createOtp, verifyOtp, deleteOtp } = require('../models/otpModel');
const { sendOtpEmail } = require('../utils/nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;

// Signup
async function signup(req, res) {
  const { name, email, username, password, phoneNumber, type } = req.body;
  console.log("Name:",name, "Email:",email, "UserName:",username, "Password:",password, phoneNumber, type);
  

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);
    
    // Check if email already exists
    const existingUser = (await getUserByEmail(email))[0];
    if (existingUser) return res.status(409).json({ error: 'Email already exists.' });

    // Check if username already exists
    const existingUsername = (await getUserByUsername(username))[0];
    if (existingUsername) return res.status(409).json({ error: 'Username already exists.' });

    // Create the user
    await createUser(name, email, username, hashedPassword, phoneNumber, type);
    res.status(200).json({ message: 'User registered successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user.' });
  }
}

// Login
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = (await getUserByEmail(email))[0];
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid password.' });

    const token = jwt.sign({ id: user.id, email: user.email, username: user.username }, JWT_SECRET, {
      expiresIn: '1h',
    });

    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Login successful.', token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login user.' });
  }
}

// Forget Password
async function forgetPassword(req, res) {
  const { email } = req.body;

  try {
    const user = (await getUserByEmail(email))[0];
    if (!user) return res.status(404).json({ error: 'User not found.' });

    const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
    await createOtp(email, otp);
    await sendOtpEmail(email, otp);

    res.json({ message: 'OTP sent successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send OTP.' });
  }
}

// Verify OTP and Set New Password
async function verifyOtpAndSetPassword(req, res) {
  const { email, otp, newPassword } = req.body;

  try {
    const otpRecord = (await verifyOtp(email, otp))[0];
    if (!otpRecord) return res.status(400).json({ error: 'Invalid or expired OTP.' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUser(email, { password: hashedPassword });
    await deleteOtp(email);

    res.json({ message: 'Password reset successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to reset password.' });
  }
}

// Get Profile
async function getProfile(req, res) {
  const { username } = req.params;

  try {
    const user = (await getUserByUsername(username))[0];
    if (!user) return res.status(404).json({ error: 'User not found.' });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
}

// Edit Profile
async function editProfile(req, res) {
  const { updates } = req.body;
  const { email } = req.user; // User is attached by middleware

  try {
    await updateUser(email, updates);
    res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
}

// Logout
async function logout(req, res) {
  res.clearCookie('token');
  res.json({ message: 'Logout successful.' });
}

// Delete Profile
async function deleteProfile(req, res) {
  const { email } = req.user; // User is attached by middleware

  try {
    await deleteUser(email);
    res.json({ message: 'Profile deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete profile.' });
  }
}

module.exports = {
  signup,
  login,
  forgetPassword,
  verifyOtpAndSetPassword,
  getProfile,
  editProfile,
  logout,
  deleteProfile,
};
