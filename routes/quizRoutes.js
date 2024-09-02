const express = require("express");
const router = express.Router();
const QuizController = require("../controllers/quizController");

// Quiz routes
router.get("/quiz", QuizController.getQuiz); // Use query parameters for classId
router.post("/submit", QuizController.submitResult);
router.get("/results", QuizController.getResults);
router.post("/add-questions", QuizController.addQuestions);

module.exports = router;
