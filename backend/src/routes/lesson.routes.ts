import { Router } from 'express';
import { getLessons, getLessonById, createLesson, updateLesson, deleteLesson, summarizeLesson, summarizeLessonPdf } from '../controllers/lesson.controller';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', authenticate, getLessons);
router.get('/:id', authenticate, getLessonById);
router.post('/', authenticate, createLesson);
router.put('/:id', authenticate, updateLesson);
router.patch('/:id', authenticate, updateLesson);
router.delete('/:id', authenticate, deleteLesson);
router.post('/summarize', authenticate, summarizeLesson);
router.post('/summarize-pdf', authenticate, upload.single('file'), summarizeLessonPdf);

export default router;
