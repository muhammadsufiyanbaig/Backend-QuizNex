require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const keyGenerator = require("./utils/keyGenerator");
const { createUserTable } = require("./models/userModel");
const { createTeacherTable } = require("./models/TeacherModel");
const { createKeysTable } = require("./models/keyModel");
const { createQuizTables } = require("./models/quizModel");
const keyRoutes = require("./routes/keyRoutes");
const userRoutes = require("./routes/userRoutes");
const TeacherRoutes = require("./routes/TeacherRoutes");
const quizRoutes = require("./routes/quizRoutes");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());
app.use(bodyParser.json());

async function initializeTables() {
  await createUserTable();
  await createTeacherTable();
  await createKeysTable();
  await createQuizTables();
}

initializeTables();

app.use("/", userRoutes);
app.use("/teacher", TeacherRoutes);
app.use("/quiz", quizRoutes);
app.use("/key", keyRoutes);
keyGenerator.start();

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});