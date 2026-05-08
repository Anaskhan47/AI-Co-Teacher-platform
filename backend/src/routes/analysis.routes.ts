
import express from 'express';
import { analyzeData } from '../controllers/analysis.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/analyze-data', authenticate, analyzeData);

export default router;
