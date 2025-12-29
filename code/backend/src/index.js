require('dotenv').config();

const express = require('express');
const cors = require('cors');

// Import routes
const authRoutes = require('./routes/auth');
const tutorRoutes = require('./routes/tutors');
const studentRoutes = require('./routes/students');
const lessonRoutes = require('./routes/lessons');
const announcementRoutes = require('./routes/announcements');
const courseRoutes = require('./routes/courses'); // Import course routes

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/courses', courseRoutes); // Use course routes

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Tutormi API server running on port ${PORT}`);
});

module.exports = app;
