const express = require('express');
const db = require('../db');
const { authenticateToken, requireStudent } = require('../middleware/auth');

const router = express.Router();

// Get student profile
router.get('/profile', authenticateToken, requireStudent, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT s.*, t.first_name as tutor_first_name, t.last_name as tutor_last_name, t.email as tutor_email
       FROM students s
       LEFT JOIN tutors t ON s.tutor_id = t.id
       WHERE s.id = ?`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const student = result.rows[0];
    res.json({
      id: student.id,
      email: student.email,
      firstName: student.first_name,
      lastName: student.last_name,
      gradeLevel: student.grade_level,
      status: student.status,
      tutor: student.tutor_id ? {
        firstName: student.tutor_first_name,
        lastName: student.tutor_last_name,
        email: student.tutor_email
      } : null,
      createdAt: student.created_at
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Get student's tutor info
router.get('/tutor', authenticateToken, requireStudent, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.id, t.first_name, t.last_name, t.email, t.subject, t.bio
       FROM tutors t
       JOIN students s ON s.tutor_id = t.id
       WHERE s.id = ?`,
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tutor not found' });
    }

    const tutor = result.rows[0];
    res.json({
      id: tutor.id,
      firstName: tutor.first_name,
      lastName: tutor.last_name,
      email: tutor.email,
      subject: tutor.subject,
      bio: tutor.bio
    });
  } catch (error) {
    console.error('Get tutor error:', error);
    res.status(500).json({ error: 'Failed to get tutor info' });
  }
});

module.exports = router;
