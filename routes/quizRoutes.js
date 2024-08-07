const express = require("express");
const { getQuiz, submitQuiz, addQuestions, getScores   } = require("../controllers/quizController");
const authenticate = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/quizData", authenticate, getQuiz);
router.post("/quiz", authenticate, submitQuiz);
router.post("/addQuestions", authenticate, addQuestions);
router.get("/scores", authenticate, getScores);
module.exports = router;