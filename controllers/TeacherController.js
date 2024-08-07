const bcrypt = require("bcrypt");
const { generateToken } = require("../middleware/jwtUtils");
const { findTeacherByEmail, insertTeacher, findTeacherById, updateTeacher, deleteTeacher } = require("../models/TeacherModel");

const keyCode = "QUIZWIZ_TEACHER";

async function signupTeacher(req, res) {
  const { fullName, email, password, key } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const existingUser = await findTeacherByEmail(email);
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Teacher member already exists" });
    }

    if (keyCode === key) {
      await insertTeacher(fullName, email, hashedPassword);
      const token = generateToken({ email });
      res.json({ message: "Teacher member signed up successfully", token });
    } else {
      res.status(400).json({ error: "Invalid key" });
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
    const Teacher = await findTeacherByEmail(email);
    if (Teacher.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, Teacher[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken({
      id: Teacher[0].id,
      fullName: Teacher[0].fullName,
      email: Teacher[0].email,
    });
    res.cookie("token", token, {
      httpOnly: true,
      // maxAge: 60 * 60 * 1000,
    });

    return res.json({ msg: "success", id: Teacher[0].id });
  } catch (error) {
    console.error("Error while comparing passwords:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getTeacher(req, res) {
  const { id } = req.body;
  try {
    const Teacher = await findTeacherById(id);
    // console.log(Teacher);
    if (Teacher.length === 0) {
      return res.status(404).json({ error: "Teacher member not found" });
    }
    res.json(Teacher[0]);
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
    const Teacher = await findTeacherById(id);
    if (Teacher.length === 0) {
      return res.status(404).json({ error: "Teacher member not found" });
    }
    
    let hashedPassword = Teacher[0].password;
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
    const Teacher = await findTeacherById(id);
    if (Teacher.length === 0) {
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