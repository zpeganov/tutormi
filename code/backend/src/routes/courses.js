const express = require('express');
const { body, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { authenticateToken, requireTutor, requireStudent } = require('../middleware/auth');

const router = express.Router();

// Get all courses for the logged-in tutor
router.get('/', authenticateToken, requireTutor, async (req, res) => {
  try {
    // Correctly await the query and access the .rows property from the returned object
    const { rows } = await db.query(
      `SELECT c.*, COUNT(sce.student_id) as student_count 
       FROM courses c 
       LEFT JOIN student_course_enrollments sce ON c.id = sce.course_id AND sce.status = 'approved'
       WHERE c.tutor_id = ? 
       GROUP BY c.id`,
      [req.user.id]
    );
    // Send the rows back in the 'courses' property of the JSON response
    res.json({ courses: rows });
  } catch (error) {
    console.error("Error in GET /api/courses:", error); // Enhanced logging
    res.status(500).json({ 
      error: 'Failed to get courses',
      details: error.message // Send back error details for debugging
    });
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

// Student joins a course
router.post('/join', authenticateToken, requireStudent, [
  body('courseCode').trim().notEmpty().withMessage('Course code is required.')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { courseCode } = req.body;
  const studentId = req.user.id;

  try {
    // Find the course by its ID (which is the 7-character code)
    const { rows: courses } = await db.query('SELECT id FROM courses WHERE id = ?', [courseCode]);
    if (courses.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    const courseId = courses[0].id;

    // Check if the student is already enrolled
    const { rows: existingEnrollment } = await db.query(
      'SELECT * FROM student_course_enrollments WHERE student_id = ? AND course_id = ?',
      [studentId, courseId]
    );

    if (existingEnrollment.length > 0) {
      return res.status(409).json({ message: 'You are already enrolled in this course.' });
    }

    // Create a new enrollment request
    await db.query(
      'INSERT INTO student_course_enrollments (student_id, course_id, status) VALUES (?, ?, ?)',
      [studentId, courseId, 'pending']
    );

    res.status(201).json({ message: 'Enrollment request sent successfully.' });
  } catch (error) {
    console.error('Join course error:', error);
    res.status(500).json({ message: 'Failed to join course.' });
  }
});

// Get course details including lessons and announcements
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    // Get course details
    const courseResult = await db.query('SELECT * FROM courses WHERE id = ?', [id]);
    if (courseResult.rows.length === 0) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    const course = courseResult.rows[0];

    // Get lessons for the course
    const lessonsResult = await db.query('SELECT * FROM lessons WHERE course_id = ?', [id]);
    const lessons = lessonsResult.rows;

    // Get announcements for the course
    const announcementsResult = await db.query('SELECT * FROM announcements WHERE course_id = ?', [id]);
    const announcements = announcementsResult.rows;

    // Check if the student is enrolled in the course
    const enrollmentResult = await db.query(
      'SELECT * FROM student_course_enrollments WHERE course_id = ? AND student_id = ?',
      [id, studentId]
    );
    const isEnrolled = enrollmentResult.rows.length > 0;

    res.json({ course, lessons, announcements, isEnrolled });
  } catch (error) {
    console.error('Get course details error:', error);
    res.status(500).json({ message: 'Failed to get course details.' });
  }
});

module.exports = router;
