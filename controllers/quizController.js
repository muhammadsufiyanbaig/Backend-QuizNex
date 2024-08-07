const { getQuizData, insertResult, findResultByUserId, addMultipleQuestions, getUserScores } = require("../models/quizModel");
const { shuffleArray, getCurrentTimeFormatted } = require("../utils/timeUtils");

async function getQuiz(req, res) {
  const { user } = req.body;

  try {
    const result = await getQuizData();
    const quizData = result.map((row) => ({
      id: row.id,
      question: row.question,
      options: row.options,
      correctAnswer: row.correctanswer,
    }));
console.log(quizData);
    const frontendQuizData = quizData.map(
      ({ id, question, options, correctAnswer }) => ({
        id,
        question,
        options,
        answersQuantity: correctAnswer.length < 2 ? "single" : "multiple",
      })
    );

    const existingResult = await findResultByUserId(user);
    if (existingResult.length > 0) {
      return res.json({ success: false });
    } else {
      const shuffledQuiz = shuffleArray([...frontendQuizData]);
      const shuffled = shuffledQuiz.slice(0, 5);
      const timestamp = new Date().toISOString();
      res.json({ questions: shuffled, timestamp });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function addQuestions(req, res) {
  const { TeacherId, data } = req.body;
console.log(req.body);
  try {
    await addMultipleQuestions(parseInt(TeacherId), data);
    res.json({ message: "Questions added successfully", success: true });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  } 
}
async function submitQuiz(req, res) {
  try {
    const fetchingQuiz = await getQuizData();
    const quizData = fetchingQuiz.map((row) => ({
      id: row.id,
      question: row.question,
      options: row.options,
      correctAnswer: row.correctanswer,
    }));

    const { userResponses, user } = req.body;
    let score = 0;

    userResponses.forEach(({ questionId, userAnswer }) => {
      const currentQuestion = quizData.find((q) => q.id === questionId);
      if (!currentQuestion) {
        throw new Error("Invalid question ID");
      }

      const correctAnswers = currentQuestion.correctAnswer;
      if (
        userAnswer &&
        userAnswer.length === correctAnswers.length &&
        userAnswer.every((ans) => correctAnswers.includes(ans))
      ) {
        score++;
      }
    });

    const timestamp = getCurrentTimeFormatted();
    await insertResult(user, score, timestamp);
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}


async function getScores(req, res) {
  try {
    const scores = await getUserScores();
    console.log(scores);
    if (scores.length === 0) {
      return res.status(404).json({ error: "No scores found" });
    }
    res.json(scores);
  } catch (error) {
    console.error("Error fetching scores:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = {
  getScores,
  getQuiz,
  submitQuiz,
  addQuestions
};
