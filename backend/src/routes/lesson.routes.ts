import { Router } from 'express';
import { getLessons, getLessonById, createLesson, updateLesson, deleteLesson, summarizeLesson, summarizePDF } from '../controllers/lesson.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { upload } from '../middleware/upload.middleware.js';

const router = Router();

router.get('/', authenticate, getLessons);
router.get('/:id', authenticate, getLessonById);
router.post('/', authenticate, createLesson);
router.put('/:id', authenticate, updateLesson);
router.patch('/:id', authenticate, updateLesson);
router.delete('/:id', authenticate, deleteLesson);
router.post('/summarize', authenticate, summarizeLesson);
router.post('/summarize-pdf', authenticate, upload.single('file'), summarizePDF);

export default router;
