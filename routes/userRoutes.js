const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController');

// User registration and profile routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Class-related routes for users
router.post('/join-class', userController.joinClass);
router.get('/my-classes', userController.getMyClasses);

module.exports = router;
