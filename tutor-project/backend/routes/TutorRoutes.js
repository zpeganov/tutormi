import express from 'express';
const router = express.Router();
import { registerTutor } from '../controllers/TutorController.js';


router.post('/tutor-signup', registerTutor);

export default router;
