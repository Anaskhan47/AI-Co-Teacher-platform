import { Router } from 'express';
import { uploadFile, extractPdfText } from '../controllers/upload.controller';
import { upload } from '../middleware/upload.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Only authenticated users can upload files
router.post('/', authenticate, upload.single('file'), uploadFile);
router.post('/pdf', authenticate, upload.single('file'), extractPdfText);

export default router;
