const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authenticateToken, requireTutor } = require('../middleware/auth');

const router = express.Router();

// Get all announcements
router.get('/', authenticateToken, async (req, res) => {
  try {
    let query;
    let params;

    if (req.user.userType === 'tutor') {
      // Tutors see only their own announcements
      query = `
        SELECT a.*, t.first_name as tutor_first_name, t.last_name as tutor_last_name
        FROM announcements a
        JOIN tutors t ON a.tutor_id = t.id
        WHERE a.tutor_id = ?
        ORDER BY a.created_at DESC
      `;
      params = [req.user.id];
    } else {
      // Students see announcements from their tutor
      query = `
        SELECT a.*, t.first_name as tutor_first_name, t.last_name as tutor_last_name
        FROM announcements a
        JOIN tutors t ON a.tutor_id = t.id
        JOIN students s ON s.tutor_id = t.id
        WHERE s.id = ? AND s.status = 'approved'
        ORDER BY a.created_at DESC
      `;
      params = [req.user.id];
    }

    const result = await db.query(query, params);

    res.json({
      announcements: result.rows.map(a => ({
        id: a.id,
        title: a.title,
        content: a.content,
        priority: a.priority,
        tutor: {
          firstName: a.tutor_first_name,
          lastName: a.tutor_last_name
        },
        createdAt: a.created_at,
        updatedAt: a.updated_at
      }))
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({ error: 'Failed to get announcements' });
  }
});

// Create announcement (tutors only)
router.post('/', authenticateToken, requireTutor, [
  body('title').trim().notEmpty(),
  body('content').trim().notEmpty(),
  body('priority').optional().isIn(['low', 'normal', 'high'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, priority } = req.body;
    const id = uuidv4();

    await db.query(
      `INSERT INTO announcements (id, tutor_id, title, content, priority)
       VALUES (?, ?, ?, ?, ?)`,
      [id, req.user.id, title, content, priority || 'normal']
    );

    res.status(201).json({
      message: 'Announcement created successfully',
      announcement: {
        id,
        title,
        content,
        priority: priority || 'normal',
        createdAt: new Date()
      }
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

// Update announcement (tutors only, own announcements)
router.put('/:id', authenticateToken, requireTutor, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, priority } = req.body;

    // First check if the announcement exists
    const checkResult = await db.query(
      'SELECT * FROM announcements WHERE id = ? AND tutor_id = ?',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found or not authorized' });
    }

    const existing = checkResult.rows[0];

    // Update
    await db.query(
      `UPDATE announcements 
       SET title = ?, content = ?, priority = ?
       WHERE id = ? AND tutor_id = ?`,
      [
        title || existing.title,
        content || existing.content,
        priority || existing.priority,
        id,
        req.user.id
      ]
    );

    res.json({
      message: 'Announcement updated successfully',
      announcement: {
        id,
        title: title || existing.title,
        content: content || existing.content,
        priority: priority || existing.priority,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
});

// Delete announcement (tutors only, own announcements)
router.delete('/:id', authenticateToken, requireTutor, async (req, res) => {
  try {
    const { id } = req.params;

    // First check if it exists
    const checkResult = await db.query(
      'SELECT id FROM announcements WHERE id = ? AND tutor_id = ?',
      [id, req.user.id]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Announcement not found or not authorized' });
    }

    await db.query('DELETE FROM announcements WHERE id = ?', [id]);

    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
});

module.exports = router;
