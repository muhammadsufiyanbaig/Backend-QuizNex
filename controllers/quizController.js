const { getQuizData, insertResult, findResultByUserId, addMultipleQuestions, getUserScores } = require("../models/quizModel");
const { getCurrentTimeFormatted } = require("../utils/timeUtils");

async function getQuiz(req, res) {
  const { classId } = req.query; // use query parameters instead of URL parameters
  try {
    const quizData = await getQuizData(classId);
    if (quizData.length === 0) {
      return res.status(404).json({ error: "No quiz data found for this class" });
    }
    res.json(quizData);
  } catch (error) {
    console.error("Error fetching quiz data:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function submitResult(req, res) {
  const { userId, score } = req.body;
  const timestamp = getCurrentTimeFormatted();

  try {
    await insertResult(userId, score, timestamp);
    res.json({ message: "Result submitted successfully" });
  } catch (error) {
    console.error("Error submitting result:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getResults(req, res) {
  try {
    const results = await getUserScores();
    res.json(results);
  } catch (error) {
    console.error("Error fetching user scores:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function addQuestions(req, res) {
  const { teacherId, classId, questions } = req.body;

  try {
    await addMultipleQuestions(teacherId, classId, questions);
    res.json({ message: "Questions added successfully" });
  } catch (error) {
    console.error("Error adding questions:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  getQuiz,
  submitResult,
  getResults,
  addQuestions
};
