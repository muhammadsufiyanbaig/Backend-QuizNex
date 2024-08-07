const express = require("express");
const { signup, login, logout, getUser, updateUser, deleteUser } = require("../controllers/userController");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/portal", authenticate, getUser);
router.put("/update", authenticate, updateUser);
router.delete("/delete", authenticate, deleteUser);

module.exports = router;
