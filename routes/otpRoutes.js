const express = require('express');
const router = express.Router();
const { requestOTP, verifyOTP } = require('../controllers/otpController');

router.post('/request', requestOTP);
router.post('/verify', verifyOTP);

module.exports = router;
