require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const keyGenerator = require("./utils/keyGenerator");
const { createUserTable } = require("./models/userModel");
const { createTeacherTable } = require("./models/TeacherModel");
const { createClassesTable } = require("./models/classModel");
const { createOtpsTable } = require("./models/otpModel");
const { createQuizTables } = require("./models/quizModel");
const userRoutes = require("./routes/userRoutes");
const TeacherRoutes = require("./routes/TeacherRoutes");
const quizRoutes = require("./routes/quizRoutes");
const emailRoutes = require("./routes/emailRoutes");
const otpRoutes = require("./routes/otpRoutes");
const classRoutes = require("./routes/classRoutes");


const app = express();
const PORT = process.env.PORT || 5001;

app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://quizzical-keen.vercel.app",
      "https://quizzen.vercel.app",
      "https://quiznex.vercel.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());
app.use(bodyParser.json());

async function initializeTables() {
  await createTeacherTable();   // Create teachers table first
  await createUserTable();      // Create users (students) table next
  await createClassesTable();   // Create classes table after users and teachers
  await createQuizTables();     // Create quizData and result tables after classes and teacher
  await createOtpsTable();      // Create otps table last as it's independent
}

// Initialize all tables
initializeTables();


app.use("/user", userRoutes);
app.use("/teacher", TeacherRoutes);
app.use("/quiz", quizRoutes);
app.use("/contact", emailRoutes);
app.use("/otp", otpRoutes);
app.use("/class", classRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});