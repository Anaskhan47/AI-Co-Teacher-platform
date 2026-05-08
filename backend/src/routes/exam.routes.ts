import { Router } from 'express';
import { generateExamPaper } from '../controllers/exam.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate', authenticate, generateExamPaper);

export default router;
