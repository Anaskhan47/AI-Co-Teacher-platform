import { Router } from 'express';
import { generateQuizAI, saveQuiz, getQuizzes, getQuizById } from '../controllers/quiz.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate', authenticate, generateQuizAI);
router.post('/save', authenticate, saveQuiz);
router.get('/', authenticate, getQuizzes);
router.get('/:id', authenticate, getQuizById);

export default router;
