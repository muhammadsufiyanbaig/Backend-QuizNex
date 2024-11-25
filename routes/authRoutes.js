const express = require('express');
const {
  signup,
  login,
  forgetPassword,
  verifyOtpAndSetPassword,
  getProfile,
  editProfile,
  logout,
  deleteProfile,
} = require('../controllers/authController');

const { authenticateToken } = require('../middleware/authMiddleware');
const { validateSignupInput } = require('../middleware/validateSignupInput');
const { verifyPassword } = require('../middleware/passwordMiddleware');

const router = express.Router();

router.post('/signup', validateSignupInput, signup);
router.post('/login', login);
router.post('/forget-password', forgetPassword);
router.post('/verify-otp', verifyOtpAndSetPassword);

router.get('/profile/:username', authenticateToken, getProfile);
router.put('/edit-profile', authenticateToken, verifyPassword, editProfile);
router.post('/logout', authenticateToken, logout);
router.delete('/delete-profile', authenticateToken, deleteProfile);

module.exports = router;
