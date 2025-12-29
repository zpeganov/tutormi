require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const seedDatabase = async () => {
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
  
  try {
    await conn.beginTransaction();

    // Create sample tutors
    const tutorPassword = await bcrypt.hash('password123', 10);
    const tutor1Id = uuidv4();
    const tutor2Id = uuidv4();
    
    await conn.execute(`
      INSERT IGNORE INTO tutors (id, tutor_id, email, password_hash, first_name, last_name, subject, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [tutor1Id, 'TUT001', 'sarah@tutormi.com', tutorPassword, 'Sarah', 'Johnson', 'Mathematics', 'Experienced math tutor with 10 years of teaching experience.']);

    await conn.execute(`
      INSERT IGNORE INTO tutors (id, tutor_id, email, password_hash, first_name, last_name, subject, bio)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [tutor2Id, 'TUT002', 'mike@tutormi.com', tutorPassword, 'Mike', 'Chen', 'Science', 'Physics and Chemistry specialist.']);

    // Create sample courses
    const course1Id = uuidv4();
    const course2Id = uuidv4();
    await conn.execute(`
      INSERT IGNORE INTO courses (id, tutor_id, name, description, image_url)
      VALUES (?, ?, ?, ?, ?)
    `, [course1Id, tutor1Id, 'Algebra 101', 'An introductory course on fundamental algebraic concepts.', 'https://images.unsplash.com/photo-1589481458893-88522b477a1e?q=80&w=2940&auto=format&fit=crop']);
    
    await conn.execute(`
      INSERT IGNORE INTO courses (id, tutor_id, name, description, image_url)
      VALUES (?, ?, ?, ?, ?)
    `, [course2Id, tutor1Id, 'Calculus in a Nutshell', 'A fast-paced course on derivatives and integrals.', 'https://images.unsplash.com/photo-1634129299195-5003a63365a0?q=80&w=2940&auto=format&fit=crop']);


    // Create sample students
    const studentPassword = await bcrypt.hash('password123', 10);

    await conn.execute(`
      INSERT IGNORE INTO students (id, email, password_hash, first_name, last_name, grade_level, tutor_id, course_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [uuidv4(), 'alex@student.com', studentPassword, 'Alex', 'Thompson', '10th Grade', tutor1Id, course1Id, 'approved']);

    await conn.execute(`
      INSERT IGNORE INTO students (id, email, password_hash, first_name, last_name, grade_level, tutor_id, course_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [uuidv4(), 'emma@student.com', studentPassword, 'Emma', 'Wilson', '11th Grade', tutor1Id, course2Id, 'approved']);

    await conn.execute(`
      INSERT IGNORE INTO students (id, email, password_hash, first_name, last_name, grade_level, tutor_id, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [uuidv4(), 'pending@student.com', studentPassword, 'James', 'Brown', '9th Grade', tutor1Id, 'pending']);

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
