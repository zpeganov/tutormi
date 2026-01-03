const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
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
const db = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Generate a unique tutor ID
const generateTutorId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'TUT';
  for (let i = 0; i < 5; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Register Tutor
router.post('/register/tutor', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
  body('subject').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, subject, bio } = req.body;

    // Check if email already exists
    const existingUser = await db.query(
      'SELECT id FROM tutors WHERE email = ?',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Generate unique tutor ID
    let tutorId = generateTutorId();
    let idExists = true;
    while (idExists) {
      const check = await db.query('SELECT id FROM tutors WHERE tutor_id = ?', [tutorId]);
      if (check.rows.length === 0) {
        idExists = false;
      } else {
        tutorId = generateTutorId();
      }
    }

    // Create tutor with UUID
  const id = generateSimpleId();
    await db.query(
      `INSERT INTO tutors (id, tutor_id, email, password_hash, first_name, last_name, subject, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, tutorId, email, passwordHash, firstName, lastName, subject || null, bio || null]
    );

    // Generate JWT
    const token = jwt.sign(
      { id, email, userType: 'tutor' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Tutor registered successfully',
      token,
      user: {
        id,
        tutorId,
        email,
        firstName,
        lastName,
        subject: subject || null,
        userType: 'tutor'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Register Student
router.post('/register/student', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('firstName').trim().notEmpty(),
  body('lastName').trim().notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, firstName, lastName, gradeLevel } = req.body;

    // Check if email already exists
    const existingUser = await db.query(
      'SELECT id FROM students WHERE email = ?',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create student - no course or tutor link at registration
    const id = uuidv4();
    await db.query(
      `INSERT INTO students (id, email, password_hash, first_name, last_name, grade_level, status)
       VALUES (?, ?, ?, ?, ?, ?, 'approved')`, // Students are approved by default now
      [id, email, passwordHash, firstName, lastName, gradeLevel || null]
    );

    // Generate JWT for immediate login
    const token = jwt.sign(
      { id, email, userType: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({
      message: 'Student registered successfully!',
      token,
      user: {
        id,
        email,
        firstName,
        lastName,
        gradeLevel: gradeLevel || null,
        status: 'approved',
        userType: 'student'
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login Tutor
router.post('/login/tutor', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    console.log('Tutor login attempt:', { email });

    // Find tutor
    const result = await db.query(
      'SELECT * FROM tutors WHERE email = ?',
      [email]
    );
    console.log('Tutor lookup result:', result.rows);

    if (result.rows.length === 0) {
      console.warn('Tutor not found for email:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const tutor = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, tutor.password_hash);
    if (!validPassword) {
      console.warn('Invalid password for tutor:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Check for required fields
    if (!tutor.id || !tutor.tutor_id || !tutor.first_name || !tutor.last_name) {
      console.error('Tutor record missing required fields:', tutor);
      return res.status(500).json({ error: 'Tutor record incomplete. Please contact support.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: tutor.id, email: tutor.email, userType: 'tutor' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: tutor.id,
        tutorId: tutor.tutor_id,
        email: tutor.email,
        firstName: tutor.first_name,
        lastName: tutor.last_name,
        subject: tutor.subject,
        userType: 'tutor'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Login Student
router.post('/login/student', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find student by email. No longer joining with tutors table.
    const result = await db.query(
      `SELECT * FROM students WHERE email = ?`,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const student = result.rows[0];

    // Verify password
    const validPassword = await bcrypt.compare(password, student.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // The concept of a student's status is now tied to course enrollment,
    // not the student record itself. So we remove the status checks here.

    // Generate JWT
    const token = jwt.sign(
      { id: student.id, email: student.email, userType: 'student' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: student.id,
        email: student.email,
        firstName: student.first_name,
        lastName: student.last_name,
        gradeLevel: student.grade_level,
        // No longer returning tutor or status info at the top level
        userType: 'student'
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    if (req.user.userType === 'tutor') {
      const result = await db.query(
        'SELECT id, tutor_id, email, first_name, last_name, subject, bio, created_at FROM tutors WHERE id = ?',
        [req.user.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const tutor = result.rows[0];
      res.json({
        id: tutor.id,
        tutorId: tutor.tutor_id,
        email: tutor.email,
        firstName: tutor.first_name,
        lastName: tutor.last_name,
        subject: tutor.subject,
        bio: tutor.bio,
        userType: 'tutor'
      });
    } else {
      const result = await db.query(
        `SELECT s.*, t.first_name as tutor_first_name, t.last_name as tutor_last_name
         FROM students s
         LEFT JOIN tutors t ON s.tutor_id = t.id
         WHERE s.id = ?`,
        [req.user.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      const student = result.rows[0];
      res.json({
        studentId: student.student_id, // human-readable ID
        email: student.email,
        firstName: student.first_name,
        lastName: student.last_name,
        gradeLevel: student.grade_level,
        status: student.status,
        tutor: {
          firstName: student.tutor_first_name,
          lastName: student.tutor_last_name
        },
        userType: 'student'
      });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

module.exports = router;
