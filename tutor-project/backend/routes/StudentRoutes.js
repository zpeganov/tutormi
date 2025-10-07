import express from 'express';
const router = express.Router();
import { registerStudent, loginStudent } from '../controllers/StudentController.js';

router.post('/student-signup', registerStudent);

router.post('/student-login', loginStudent);

export default router;
