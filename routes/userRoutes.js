const express = require("express");
const { signup, login, logout, getUser, updateUser, deleteUser } = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/auth/signup", signup);
router.post("/auth/login", login);
router.get("/auth/logout", logout);
router.post("/portal", authenticate, getUser);
router.put("/auth/update", authenticate, updateUser);
router.delete("/auth/delete", authenticate, deleteUser);

module.exports = router;
