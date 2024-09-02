const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/jwtUtils");
const {
  findTeacherByEmail,
  insertTeacher,
  findTeacherById,
  updateTeacher,
  deleteTeacher,
} = require("../models/TeacherModel");

async function signupTeacher(req, res) {
  const { fullName, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await findTeacherByEmail(email);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Teacher member already exists" });
    }

    if (fullName && email && password) {
      await insertTeacher(fullName, email, hashedPassword);
      const token = generateToken({ email });
      res.json({ message: "Teacher member signed up successfully", token });
    } else {
      res.status(400).json({ error: "Invalid data" });
    }
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function loginTeacher(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const teacher = await findTeacherByEmail(email);
    if (teacher.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, teacher[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      id: teacher[0].id,
      fullName: teacher[0].fullName,
      email: teacher[0].email,
    });
    res.cookie("token", token, { httpOnly: true });

    return res.json({ msg: "success", id: teacher[0].id });
  } catch (error) {
    console.error("Error while comparing passwords:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getTeacher(req, res) {
  const { id } = req.body;
  try {
    const teacher = await findTeacherById(id);
    if (teacher.length === 0) {
      return res.status(404).json({ error: "Teacher member not found" });
    }
    res.json(teacher[0]);
  } catch (error) {
    console.error("Error fetching Teacher member:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function logout(req, res) {
  res.cookie("token", "", { expires: new Date(0), httpOnly: true });
  res.status(200).json({ success: true, message: "User logged out successfully" });
}

async function updateTeacherInfo(req, res) {
  const { id, fullName, email, password } = req.body;

  try {
    const teacher = await findTeacherById(id);
    if (teacher.length === 0) {
      return res.status(404).json({ error: "Teacher member not found" });
    }

    let hashedPassword = teacher[0].password;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    await updateTeacher(id, fullName, email, hashedPassword);
    res.json({ message: "Teacher information updated successfully" });
  } catch (error) {
    console.error("Error updating Teacher information:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteTeacherProfile(req, res) {
  const { id } = req.body;

  try {
    const teacher = await findTeacherById(id);
    if (teacher.length === 0) {
      return res.status(404).json({ error: "Teacher member not found" });
    }

    await deleteTeacher(id);
    res.json({ message: "Teacher profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting Teacher profile:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  logout,
  signupTeacher,
  loginTeacher,
  getTeacher,
  updateTeacherInfo,
  deleteTeacherProfile,
};
