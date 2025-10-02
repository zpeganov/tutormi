import express from 'express';
const router = express.Router();
import { registerStudent } from '../controllers/StudentController.js';

router.post('/student-signup', registerStudent);

export default router;
