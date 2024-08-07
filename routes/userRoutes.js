const express = require("express");
const { signup, login, logout,getUser } = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/auth/logout", logout);
router.post("/portal", authenticate,getUser);

module.exports = router;