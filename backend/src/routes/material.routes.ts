import { Router } from 'express';
import { generateMaterial, generatePPT } from '../controllers/material.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/generate', authenticate, generateMaterial);
router.post('/generate-ppt', authenticate, generatePPT);

export default router;
