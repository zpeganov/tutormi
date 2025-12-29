const express = require('express');
const db = require('../db');
const { authenticateToken, requireTutor } = require('../middleware/auth');

const router = express.Router();

// Get tutor profile
router.get('/profile', authenticateToken, requireTutor, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, tutor_id, email, first_name, last_name, subject, bio, created_at FROM tutors WHERE id = ?',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tutor not found' });
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
      createdAt: tutor.created_at
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Get a tutor's approved students
router.get('/my-students', authenticateToken, requireTutor, async (req, res) => {
  try {
    const [students] = await db.pool.query(
      `SELECT s.id, s.first_name, s.last_name, s.email, s.grade_level, c.name as course_name
       FROM students s
       LEFT JOIN courses c ON s.course_id = c.id
       WHERE s.tutor_id = ? AND s.status = 'approved'
       ORDER BY s.last_name, s.first_name`,
      [req.user.id]
    );
    res.json({ students });
  } catch (error) {
    console.error('Get my-students error:', error);
    res.status(500).json({ error: 'Failed to get students' });
  }
});

// Get pending student requests
router.get('/requests', authenticateToken, requireTutor, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, email, first_name, last_name, grade_level, status, created_at
       FROM students
       WHERE tutor_id = ? AND status = 'pending'
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({
      requests: result.rows.map(s => ({
        id: s.id,
        email: s.email,
        firstName: s.first_name,
        lastName: s.last_name,
        gradeLevel: s.grade_level,
        status: s.status,
        createdAt: s.created_at
      }))
    });
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ error: 'Failed to get requests' });
  }
});

// Accept student request
router.post('/requests/:studentId/accept', authenticateToken, requireTutor, async (req, res) => {
  try {
    const { studentId } = req.params;

    // First check if the student exists and is pending
    const checkResult = await db.query(
      `SELECT id, email, first_name, last_name FROM students 
       WHERE id = ? AND tutor_id = ? AND status = 'pending'`,
      [studentId, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found or already processed' });
    }

    // Update the student status
    await db.query(
      `UPDATE students SET status = 'approved' WHERE id = ? AND tutor_id = ?`,
      [studentId, req.user.id]
    );

    const student = checkResult.rows[0];
    res.json({
      message: 'Student accepted successfully',
      student: {
        id: student.id,
        email: student.email,
        firstName: student.first_name,
        lastName: student.last_name
      }
    });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

// Decline student request
router.post('/requests/:studentId/decline', authenticateToken, requireTutor, async (req, res) => {
  try {
    const { studentId } = req.params;

    // First check if the student exists and is pending
    const checkResult = await db.query(
      `SELECT id FROM students WHERE id = ? AND tutor_id = ? AND status = 'pending'`,
      [studentId, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found or already processed' });
    }

    // Update the student status
    await db.query(
      `UPDATE students SET status = 'declined' WHERE id = ? AND tutor_id = ?`,
      [studentId, req.user.id]
    );

    res.json({ message: 'Student request declined' });
  } catch (error) {
    console.error('Decline request error:', error);
    res.status(500).json({ error: 'Failed to decline request' });
  }
});

// Get tutor's students (approved only)
router.get('/students', authenticateToken, requireTutor, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, email, first_name, last_name, grade_level, created_at, updated_at
       FROM students
       WHERE tutor_id = ? AND status = 'approved'
       ORDER BY first_name, last_name`,
      [req.user.id]
    );

    res.json({
      students: result.rows.map(s => ({
        id: s.id,
        email: s.email,
        firstName: s.first_name,
        lastName: s.last_name,
        gradeLevel: s.grade_level,
        joinedAt: s.updated_at,
        createdAt: s.created_at
      }))
    });
  } catch (error) {
    console.error('Get students error:', error);
    res.status(500).json({ error: 'Failed to get students' });
  }
});

module.exports = router;
