require('dotenv').config();
const mysql = require('mysql2/promise');

const createTables = async () => {
  // First connect without database to create it if needed
  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  };

  let connection;
  
  try {
    // Create database if it doesn't exist
    connection = await mysql.createConnection(connectionConfig);
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'tutormi'}\``);
    await connection.end();

    // Now connect to the database
    const pool = mysql.createPool({
      ...connectionConfig,
      database: process.env.DB_NAME || 'tutormi',
      waitForConnections: true,
      connectionLimit: 10
    });

    const conn = await pool.getConnection();

    // Create Tutors Table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS tutors (
        id VARCHAR(36) NOT NULL,
        tutor_id VARCHAR(50) UNIQUE,
        email VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        subject VARCHAR(100),
        bio TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY (tutor_id)
      )
    `);

    // Create Courses Table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(7) NOT NULL,
        tutor_id VARCHAR(36) NOT NULL,
        course_code VARCHAR(20) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(2048),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY (course_code),
        FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE
      )
    `);

    // Create Students Table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS students (
        id VARCHAR(36) NOT NULL,
        student_id VARCHAR(50) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        grade_level VARCHAR(50),
  tutor_id VARCHAR(36),
  course_id VARCHAR(7),
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY (email),
        UNIQUE KEY (student_id),
        FOREIGN KEY (tutor_id) REFERENCES tutors(tutor_id) ON DELETE SET NULL,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
      )
    `);

    // Create Lessons Table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS lessons (
        id VARCHAR(36) NOT NULL,
        tutor_id VARCHAR(36) NOT NULL,
        course_id VARCHAR(7) NOT NULL,
        title VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      )
    `);

    // Create Announcements Table
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS announcements (
        id VARCHAR(36) PRIMARY KEY,
        tutor_id VARCHAR(36),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        priority VARCHAR(20) DEFAULT 'normal',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (tutor_id) REFERENCES tutors(id) ON DELETE CASCADE
      )
    `);

    // Create student_requests table (for tracking registration requests)
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS student_requests (
        id VARCHAR(36) PRIMARY KEY,
        student_id VARCHAR(50),
        tutor_id VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
        FOREIGN KEY (tutor_id) REFERENCES tutors(tutor_id) ON DELETE CASCADE,
        UNIQUE KEY unique_request (student_id, tutor_id)
      )
    `);

    conn.release();
    await pool.end();
    
    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

createTables();
