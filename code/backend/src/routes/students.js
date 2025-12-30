
const express = require('express');
const db = require('../db');
const { authenticateToken, requireStudent } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Get all courses the logged-in student is enrolled in
router.get('/me/courses', authenticateToken, requireStudent, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT c.*
       FROM courses c
       JOIN students s ON c.id = s.course_id
       WHERE s.id = ? AND s.status = 'approved'`,
      [req.user.id]
    );
    res.json({ courses: result.rows });
  } catch (error) {
    console.error('Get student courses error:', error);
    res.status(500).json({ error: 'Failed to get student courses' });
  }
});

// Update student profile
router.put('/me', authenticateToken, requireStudent, async (req, res) => {
  try {
    const firstName = req.body.firstName || req.body.first_name;
    const lastName = req.body.lastName || req.body.last_name;
    const email = req.body.email;
    // Only update fields that are provided
    if (!firstName && !lastName && !email) {
      return res.status(400).json({ error: 'At least one field (firstName, lastName, email) is required.' });
    }
    // Check if email is already used by another student
    if (email) {
      const emailCheck = await db.query(
        'SELECT id FROM students WHERE email = ? AND id != ?',
        [email, req.user.id]
      );
      if (emailCheck.rows.length > 0) {
        return res.status(400).json({ error: 'Email already in use.' });
      }
    }
    // Build dynamic update query
    const updates = [];
    const params = [];
    if (firstName) {
      updates.push('first_name = ?');
      params.push(firstName);
    }
    if (lastName) {
      updates.push('last_name = ?');
      params.push(lastName);
    }
    if (email) {
      updates.push('email = ?');
      params.push(email);
    }
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update.' });
    }
    params.push(req.user.id);
    await db.query(
      `UPDATE students SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    res.json({ message: 'Profile updated successfully.' });
  } catch (error) {
    console.error('Update student profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// Change student password
router.put('/me/password', authenticateToken, requireStudent, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }
    // Get current password hash
    const result = await db.query('SELECT password_hash FROM students WHERE id = ?', [req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Student not found.' });
    }
    const student = result.rows[0];
    const valid = await bcrypt.compare(currentPassword, student.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }
    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE students SET password_hash = ? WHERE id = ?', [newHash, req.user.id]);
    res.json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change student password error:', error);

    res.status(500).json({ error: 'Failed to update password.' });
  }
});


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
      studentId: student.student_id, // human-readable ID
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
