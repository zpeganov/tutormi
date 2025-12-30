const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authenticateToken, requireTutor } = require('../middleware/auth');

const router = express.Router();

// Get all courses for the logged-in tutor
router.get('/', authenticateToken, requireTutor, async (req, res) => {
  try {
    const [courses] = await db.pool.query(
      `SELECT c.*, COUNT(s.id) as student_count 
       FROM courses c 
       LEFT JOIN students s ON c.id = s.course_id AND s.status = 'approved'
       WHERE c.tutor_id = ? 
       GROUP BY c.id`,
      [req.user.id]
    );
    res.json({ courses });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ error: 'Failed to get courses' });
  }
});

// Create a new course
router.post('/', authenticateToken, requireTutor, [
  body('name').trim().notEmpty().withMessage('Course name is required.'),
  body('description').optional().trim()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, image_url, course_code } = req.body;
    if (!course_code) {
      return res.status(400).json({ error: 'Course code is required.' });
    }
    const newCourse = {
      id: uuidv4(),
      tutor_id: req.user.id,
      course_code,
      name,
      description,
      image_url: image_url || null
    };

    await db.pool.query('INSERT INTO courses SET ?', newCourse);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update a course
router.put('/:id', authenticateToken, requireTutor, [
  body('name').optional().trim().notEmpty(),
  body('description').optional().trim(),
  body('image_url').optional().custom((value) => {
    if (!value) return true;
    // Accept standard URLs or data URLs
    const isHttpUrl = /^https?:\/\//.test(value);
    const isDataUrl = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(value);
    if (isHttpUrl || isDataUrl) return true;
    throw new Error('image_url must be a valid URL or data URL');
  })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    try {
        const { id } = req.params;
        const { name, description, image_url } = req.body;

        const [course] = await db.pool.query('SELECT * FROM courses WHERE id = ? AND tutor_id = ?', [id, req.user.id]);

        if (course.length === 0) {
            return res.status(404).json({ error: 'Course not found or you do not have permission to edit it.' });
        }

        const updatedFields = {};
        if (name) updatedFields.name = name;
        if (description) updatedFields.description = description;
        if (image_url) updatedFields.image_url = image_url;

        if (Object.keys(updatedFields).length === 0) {
            return res.status(400).json({ error: 'No fields to update.' });
        }

        await db.pool.query('UPDATE courses SET ? WHERE id = ?', [updatedFields, id]);

        res.json({ message: 'Course updated successfully.' });

    } catch (error) {
        console.error('Update course error:', error);
        res.status(500).json({ error: 'Failed to update course' });
    }
});


// Delete a course
router.delete('/:id', authenticateToken, requireTutor, async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await db.pool.query('DELETE FROM courses WHERE id = ? AND tutor_id = ?', [id, req.user.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Course not found or you do not have permission to delete it.' });
        }

        res.json({ message: 'Course deleted successfully.' });
    } catch (error) {
        console.error('Delete course error:', error);
        res.status(500).json({ error: 'Failed to delete course' });
    }
});


module.exports = router;
