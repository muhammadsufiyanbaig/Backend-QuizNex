const { sql } = require('../utils/db');

async function getQuizData(classId) {
  return sql`
    SELECT id, question, options, correctAnswer 
    FROM quizData 
    WHERE class_id = ${classId}
  `;
}

async function getQuizDuratoin(classId) {
  return sql`
    SELECT quizDuration
    FROM classes 
    WHERE class_id = ${classId}
  `;
}

async function addMultipleQuestions(teacherId, classId, questions) {
  try {
    await Promise.all(
      questions.map((question) =>
        sql`
          INSERT INTO quizData (question, options, correctAnswer, teacher, class_id)
          VALUES (${question.question}, ${question.options}, ${question.correctAnswer}, ${teacherId}, ${classId})
        `
      )
    );
  } catch (error) {
    console.error("Error adding multiple quiz questions:", error);
    throw error;
  }
}

async function insertResult(userId, score, timestamp) {
  return sql`
    INSERT INTO result (user_id, quiz_score, quiz_timestamp) VALUES (${userId}, ${score}, ${timestamp})
  `;
}

async function findResultByUserId(userId) {
  return sql`SELECT quiz_score FROM result WHERE user_id = ${userId}`;
}

async function getUserScores() {
  return sql`
    SELECT u.name, u.email, r.quiz_score, r.quiz_timestamp
    FROM students u
    JOIN result r ON u.id = r.user_id
  `;
}

module.exports = {
  getQuizDuratoin,
  getQuizData,
  addMultipleQuestions,
  insertResult,
  findResultByUserId,
  getUserScores
};
