const { sql } = require('../utils/db');

async function createQuizTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS quizData (
      id SERIAL PRIMARY KEY,
      question TEXT,
      options TEXT[],
      correctAnswer TEXT[],
      faculty INT,
      FOREIGN KEY (faculty) REFERENCES faculty(id)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS result (
      user_id INT PRIMARY KEY,
      ts_quiz_score INT,
      ts_quiz_timestamp TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `;
}

async function getQuizData() {
  return sql`SELECT id, question, options, correctanswer FROM quizData`;
}
async function addMultipleQuestions(TeacherId, questions) {
  try {
    // console.log(TeacherId,questions );
    // Insert multiple questions into the table
    await Promise.all(
      questions.map((question) =>
        sql`
          INSERT INTO quizData (question, options, correctAnswer, faculty)
          VALUES (${question.question}, ${question.options}, ${question.correctAnswer}, ${TeacherId})
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
    INSERT INTO result (user_id, ts_quiz_score, ts_quiz_timestamp) VALUES (${userId}, ${score}, ${timestamp})
  `;
}

async function findResultByUserId(userId) {
  return sql`SELECT ts_quiz_score FROM result WHERE user_id = ${userId}`;
}


async function getUserScores() {
  return sql`
    SELECT u.fullName, u.email, r.ts_quiz_score, r.ts_quiz_timestamp
    FROM users u
    JOIN result r ON u.id = r.user_id
  `;
}

module.exports = {
  getUserScores,
  createQuizTables,
  getQuizData,
  insertResult,
  findResultByUserId,
  addMultipleQuestions
};