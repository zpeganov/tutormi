const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authenticateToken, requireTutor } = require('../middleware/auth');

const router = express.Router();

// Get all lessons (for students - only from their tutor)
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query;
    let params;

    if (req.user.userType === 'tutor') {
      // Tutors see only their own lessons
      query = `
        SELECT l.*, t.first_name as tutor_first_name, t.last_name as tutor_last_name
        FROM lessons l
        JOIN tutors t ON l.tutor_id = t.id
        WHERE l.tutor_id = ?
        ORDER BY l.created_at DESC
      `;
      params = [req.user.id];
    } else {
      // Students see lessons from their tutor
      query = `
        SELECT l.*, t.first_name as tutor_first_name, t.last_name as tutor_last_name
        FROM lessons l
        JOIN tutors t ON l.tutor_id = t.id
        JOIN students s ON s.tutor_id = t.id
        WHERE s.id = ? AND s.status = 'approved'
        ORDER BY l.created_at DESC
      `;
      params = [req.user.id];
    }

    const result = await db.query(query, params);

    console.log('DB Result for lessons:', result); // Added for debugging

    res.json({
      lessons: result.rows.map(l => ({
        id: l.id,
        title: l.title,
        subject: l.subject,
        description: l.description,
        content: l.content,
        tutor: {
          firstName: l.tutor_first_name,
          lastName: l.tutor_last_name
        },
        createdAt: l.created_at,
        updatedAt: l.updated_at
      }))
    });
  } catch (error) {
    console.error('Get lessons error:', error);
    res.status(500).json({ error: 'Failed to get lessons' });
  }
});

// Get single lesson
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.query(
      `SELECT l.*, t.first_name as tutor_first_name, t.last_name as tutor_last_name
       FROM lessons l
       JOIN tutors t ON l.tutor_id = t.id
       WHERE l.id = ?`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const l = result.rows[0];
    res.json({
      id: l.id,
      title: l.title,
      subject: l.subject,
      description: l.description,
      content: l.content,
      tutor: {
        firstName: l.tutor_first_name,
        lastName: l.tutor_last_name
      },
      createdAt: l.created_at,
      updatedAt: l.updated_at
    });
  } catch (error) {
    console.error('Get lesson error:', error);
    res.status(500).json({ error: 'Failed to get lesson' });
  }
});

// Create lesson (tutors only)
router.post('/', authenticateToken, requireTutor, [
  body('title').trim().notEmpty(),
  body('subject').trim().notEmpty(),
  body('description').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, subject, description, content } = req.body;
    const id = uuidv4();

    await db.query(
      `INSERT INTO lessons (id, tutor_id, title, subject, description, content)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, title, subject, description || null, content || null]
    );

    res.status(201).json({
      message: 'Lesson created successfully',
      lesson: {
        id,
        title,
        subject,
        description: description || null,
        content: content || null,
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ error: 'Failed to create lesson' });
  }
});

// Update lesson (tutors only, own lessons)
router.put('/:id', authenticateToken, requireTutor, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subject, description, content } = req.body;

    // First check if the lesson exists
    const checkResult = await db.query(
      'SELECT * FROM lessons WHERE id = ? AND tutor_id = ?',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found or not authorized' });
    }

    const existing = checkResult.rows[0];

    // Update with COALESCE-like logic
    await db.query(
      `UPDATE lessons 
       SET title = ?, subject = ?, description = ?, content = ?
       WHERE id = ? AND tutor_id = ?`,
      [
        title || existing.title,
        subject || existing.subject,
        description !== undefined ? description : existing.description,
        content !== undefined ? content : existing.content,
        id,
        req.user.id
      ]
    );

    res.json({
      message: 'Lesson updated successfully',
      lesson: {
        id,
        title: title || existing.title,
        subject: subject || existing.subject,
        description: description !== undefined ? description : existing.description,
        content: content !== undefined ? content : existing.content,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ error: 'Failed to update lesson' });
  }
});

// Delete lesson (tutors only, own lessons)
router.delete('/:id', authenticateToken, requireTutor, async (req, res) => {
  try {
    const { id } = req.params;

    // First check if it exists
    const checkResult = await db.query(
      'SELECT id FROM lessons WHERE id = ? AND tutor_id = ?',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Lesson not found or not authorized' });
    }

    await db.query('DELETE FROM lessons WHERE id = ?', [id]);

    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
});

module.exports = router;
