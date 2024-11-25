const { sql } = require("../utils/db");

// First create tables without foreign key constraints
async function createTablesStep1() {
  await sql`
    CREATE TABLE IF NOT EXISTS "Users" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(100) NOT NULL,
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(50) NOT NULL,
      phoneNumber VARCHAR(15),
      type VARCHAR(20) CHECK (type IN ('Student', 'Teacher')),
      classId UUID,
      classesJoined UUID[]
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS "Classes" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      key VARCHAR(100) UNIQUE NOT NULL,
      createdBy UUID,
      duration INT NOT NULL
    );
  `;
}

// Then add the foreign key constraints
async function createTablesStep2() {
  // First drop existing constraints if they exist
  await sql`
    DO $$ BEGIN
      ALTER TABLE "Users" DROP CONSTRAINT IF EXISTS fk_users_classes;
    EXCEPTION
      WHEN undefined_object THEN NULL;
    END $$;
  `;

  await sql`
    DO $$ BEGIN
      ALTER TABLE "Classes" DROP CONSTRAINT IF EXISTS fk_classes_users;
    EXCEPTION
      WHEN undefined_object THEN NULL;
    END $$;
  `;

  // Then add the constraints
  await sql`
    ALTER TABLE "Users" 
    ADD CONSTRAINT fk_users_classes 
    FOREIGN KEY (classId) 
    REFERENCES "Classes" (id) 
    ON DELETE SET NULL;
  `;

  await sql`
    ALTER TABLE "Classes" 
    ADD CONSTRAINT fk_classes_users 
    FOREIGN KEY (createdBy) 
    REFERENCES "Users" (id) 
    ON DELETE CASCADE;
  `;
}

// Function to create the "Questions" table
async function createQuestionsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS "Questions" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      question TEXT NOT NULL,
      options TEXT[],
      correctAnswer TEXT NOT NULL,
      classId UUID REFERENCES "Classes" (id) ON DELETE CASCADE
    );
  `;
}

// Function to create the "OTP" table
async function createOtpTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS "OTP" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(100) REFERENCES "Users" (email) ON DELETE CASCADE,
      sentAt TIMESTAMP NOT NULL DEFAULT NOW(),
      expireAt TIMESTAMP NOT NULL
    );
  `;
}

// Function to create the "Score" table
async function createScoreTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS "Score" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      studentName UUID REFERENCES "Users" (id) ON DELETE CASCADE,
      classId UUID REFERENCES "Classes" (id) ON DELETE CASCADE,
      marks INT NOT NULL
    );
  `;
}

// Function to create the "ClassesJoined" table
async function createClassesJoinedTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS "ClassesJoined" (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      studentName UUID REFERENCES "Users" (id) ON DELETE CASCADE,
      classId UUID REFERENCES "Classes" (id) ON DELETE CASCADE,
      joinedAt TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `;
}

// Main function to initialize the database
async function initializeDatabase() {
  try {
    await createTablesStep1();
    await createTablesStep2();
    await createQuestionsTable();
    await createOtpTable();
    await createScoreTable();
    await createClassesJoinedTable();
    console.log('All tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error.message);
  }
}

module.exports = { initializeDatabase };