require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

// Helper to generate a random 7-character alphanumeric ID
function generateSimpleId(prefix = '') {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';
  for (let i = 0; i < 7; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return prefix + id;
}

const seedDatabase = async () => {
  // Clean all tables for a fresh seed

  const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'tutormi',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 10
  });

  const conn = await pool.getConnection();

  // Clean all tables for a fresh seed (must be after conn is initialized)
  await conn.query('SET FOREIGN_KEY_CHECKS = 0');
  await conn.query('TRUNCATE TABLE students');
  await conn.query('TRUNCATE TABLE courses');
  await conn.query('TRUNCATE TABLE tutors');
  await conn.query('TRUNCATE TABLE lessons');
  await conn.query('TRUNCATE TABLE announcements');
  await conn.query('TRUNCATE TABLE student_course_enrollments');
  await conn.query('SET FOREIGN_KEY_CHECKS = 1');

  try {
    await conn.beginTransaction();

    // Create sample tutors
  const tutorPassword = await bcrypt.hash('password123', 10);
  const tutor1Id = uuidv4();
  const tutor2Id = uuidv4();
  const tutor1Code = generateSimpleId('TUT');
  const tutor2Code = generateSimpleId('TUT');
    
    await conn.execute(`
      INSERT IGNORE INTO tutors (id, tutor_id, email, password_hash, first_name, last_name, subject, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [tutor1Id, tutor1Code, 'sarah@tutormi.com', tutorPassword, 'Sarah', 'Johnson', 'Mathematics', 'Experienced math tutor with 10 years of teaching experience.']);

    await conn.execute(`
      INSERT IGNORE INTO tutors (id, tutor_id, email, password_hash, first_name, last_name, subject, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [tutor2Id, tutor2Code, 'mike@tutormi.com', tutorPassword, 'Mike', 'Chen', 'Science', 'Physics and Chemistry specialist.']);

    // Create sample courses
  const course1Id = generateSimpleId();
  const course2Id = generateSimpleId();
  console.log('Seeding with course IDs:', course1Id, course2Id);
  await conn.execute(`
    INSERT IGNORE INTO courses (id, tutor_id, course_code, name, description, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [course1Id, tutor1Id, 'ALG101', 'Algebra 101', 'An introductory course on fundamental algebraic concepts.', 'https://images.unsplash.com/photo-1589481458893-88522b477a1e?q=80&w=2940&auto=format&fit=crop']);
  await conn.execute(`
    INSERT IGNORE INTO courses (id, tutor_id, course_code, name, description, image_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [course2Id, tutor1Id, 'CALC201', 'Calculus in a Nutshell', 'A fast-paced course on derivatives and integrals.', 'https://images.unsplash.com/photo-1634129299195-5003a63365a0?q=80&w=2940&auto=format&fit=crop']);


    // Create sample students
    const studentPassword = await bcrypt.hash('password123', 10);

    const student1Id = uuidv4();
    const student2Id = uuidv4();
    const student3Id = uuidv4();
    const student1Code = generateSimpleId('STU');
    const student2Code = generateSimpleId('STU');
    const student3Code = generateSimpleId('STU');

    await conn.execute(`
      INSERT INTO students (id, student_id, email, password_hash, first_name, last_name, grade_level)
      VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [student1Id, student1Code, 'alex@student.com', studentPassword, 'Alex', 'Thompson', '10th Grade']);

    await conn.execute(`
      INSERT INTO students (id, student_id, email, password_hash, first_name, last_name, grade_level)
      VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [student2Id, student2Code, 'emma@student.com', studentPassword, 'Emma', 'Wilson', '11th Grade']);

    await conn.execute(`
      INSERT INTO students (id, student_id, email, password_hash, first_name, last_name, grade_level)
      VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [student3Id, student3Code, 'pending@student.com', studentPassword, 'James', 'Brown', '9th Grade']);

    // Create sample lessons
    await conn.execute(`
      INSERT IGNORE INTO lessons (id, tutor_id, course_id, title, subject, description, content)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [uuidv4(), tutor1Id, course1Id, 'Introduction to Algebra', 'Mathematics', 'Learn the basics of algebraic expressions and equations.', 'Full lesson content here...']);

    await conn.execute(`
      INSERT IGNORE INTO lessons (id, tutor_id, course_id, title, subject, description, content)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [uuidv4(), tutor1Id, course2Id, 'Advanced Calculus', 'Mathematics', 'Deep dive into derivatives and integrals.', 'Calculus lesson content...']);

    // Create sample announcements
    await conn.execute(`
      INSERT IGNORE INTO announcements (id, tutor_id, title, content, priority)
      VALUES (?, ?, ?, ?, ?)
    `, [uuidv4(), tutor1Id, 'Welcome to the New Semester!', 'I hope everyone had a great break. Looking forward to a productive semester!', 'normal']);

    await conn.execute(`
      INSERT IGNORE INTO announcements (id, tutor_id, title, content, priority)
      VALUES (?, ?, ?, ?, ?)
    `, [uuidv4(), tutor1Id, 'Office Hours Update', 'Office hours will be held on Zoom this week.', 'high']);

    // Seed Student Course Enrollments
    await conn.query(`
      INSERT INTO student_course_enrollments (student_id, course_id, status) VALUES
      ('${student1Id}', '${course1Id}', 'approved'),
      ('${student2Id}', '${course2Id}', 'pending'),
      ('${student3Id}', '${course1Id}', 'approved');
    `);

    await conn.commit();
    
    console.log('✅ Database seeded successfully');
    console.log('📧 Sample tutor login: sarah@tutormi.com / password123');
    console.log('📧 Sample student login: alex@student.com / password123');
  } catch (error) {
    await conn.rollback();
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    conn.release();
    await pool.end();
  }
};

seedDatabase();
