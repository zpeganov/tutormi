import express from 'express';
const router = express.Router();
import { registerTutor, loginTutor, getTutorProfile } from '../controllers/TutorController.js';
import { protectTutor } from '../middleware/authMiddleware.js';



router.post('/tutor-signup', registerTutor);
router.post('/tutor-login', loginTutor);
router.get('/tutor-profile', protectTutor, getTutorProfile);

export default router;
