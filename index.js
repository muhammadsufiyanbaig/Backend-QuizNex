require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
// const userRoutes = require("./routes/userRoutes");
// const TeacherRoutes = require("./routes/TeacherRoutes");
// const quizRoutes = require("./routes/quizRoutes");
// const emailRoutes = require("./routes/emailRoutes");
// const otpRoutes = require("./routes/otpRoutes");
// const classRoutes = require("./routes/classRoutes");
const authRoutes = require('./routes/authRoutes');
const { initializeDatabase } = require("./models/Schema");


const app = express();
const PORT = process.env.PORT || 5000;

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

// Initialize all tables
initializeDatabase();


app.use('/auth', authRoutes);
// app.use("/user", userRoutes);
// app.use("/teacher", TeacherRoutes);
// app.use("/quiz", quizRoutes);
// app.use("/contact", emailRoutes);
// app.use("/otp", otpRoutes);
// app.use("/class", classRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});