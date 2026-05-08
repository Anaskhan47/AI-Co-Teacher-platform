import { Router } from 'express';
import { getMessages, sendMessage, markRead, sendEmailToParent } from '../controllers/message.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getMessages);
router.post('/', sendMessage);
router.post('/email', sendEmailToParent as any);
router.patch('/:id/read', markRead);

export default router;
