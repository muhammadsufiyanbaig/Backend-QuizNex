const { sql } = require('../utils/db');

async function createQuizTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS quizData (
      id SERIAL PRIMARY KEY,
      question TEXT NOT NULL,
      options TEXT[] NOT NULL,
      correctAnswer TEXT[] NOT NULL,
      teacher INT,
      class_id INT,
      FOREIGN KEY (teacher) REFERENCES teacher(id) ON DELETE CASCADE,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
    )
  `;
  
  await sql`
    CREATE TABLE IF NOT EXISTS result (
      user_id INT PRIMARY KEY,
      quiz_score INT NOT NULL,
      quiz_timestamp TIMESTAMP NOT NULL DEFAULT NOW(),
      FOREIGN KEY (user_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `;
}

async function getQuizData(classId) {
  return sql`
    SELECT id, question, options, correctAnswer 
    FROM quizData 
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
    SELECT u.fullName, u.email, r.quiz_score, r.quiz_timestamp
    FROM students u
    JOIN result r ON u.id = r.user_id
  `;
}

module.exports = {
  createQuizTables,
  getQuizData,
  addMultipleQuestions,
  insertResult,
  findResultByUserId,
  getUserScores
};
