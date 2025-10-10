import express from 'express';
const router = express.Router();
import { registerStudent, loginStudent , getStudentProfile} from '../controllers/StudentController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/student-signup', registerStudent);

router.post('/student-login', loginStudent);


router.get('/student-profile', protect, getStudentProfile);
export default router;
