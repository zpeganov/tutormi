import express from 'express';
import multer from 'multer';
import { uploadLessonPlan, getLessonPlans } from '../controllers/LessonPlanController.js';
import { protectTutor } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
router.post('/upload', protectTutor, upload.single('file'), uploadLessonPlan);
router.get('/', protectTutor, getLessonPlans);

export default router;
