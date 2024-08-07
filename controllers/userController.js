const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/jwtUtils");
const { 
  findUserByEmail, 
  insertUser, 
  findUserById, 
  updateUserById, 
  deleteUserById 
} = require("../models/userModel");

async function signup(req, res) {
  const { fullName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await findUserByEmail(email);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "You already exist" });
    }

    await insertUser(fullName, email, hashedPassword);
    const token = generateToken({ email });
    res.json({ message: "User signed up successfully", token });
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await findUserByEmail(email);
    if (user.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      id: user[0].id,
      fullName: user[0].fullName,
      email: user[0].email,
    });
    res.cookie("token", token, {
      httpOnly: true,
    });

    return res.json({ msg: "success", id: user[0].id });
  } catch (error) {
    console.error("Error while comparing passwords:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getUser(req, res) {
  const { id } = req.body;
  try {
    const user = await findUserById(id);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateUser(req, res) {
  const { id } = req.body;
  const { fullName, email, password } = req.body;

  try {
    const user = await findUserById(id);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    let hashedPassword = user[0].password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await updateUserById(id, fullName, email, hashedPassword);
    return res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteUser(req, res) {
  const { id } = req.body;

  try {
    const user = await findUserById(id);
    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await deleteUserById(id);
    res.clearCookie("token", { httpOnly: true });
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function logout(req, res) {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  res.status(200).json({ success: true, message: "User logged out successfully" });
}

module.exports = {
  signup,
  login,
  logout,
  getUser,
  updateUser,
  deleteUser,
};
