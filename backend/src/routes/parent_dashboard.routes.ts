import { Router } from 'express';
import { getParentDashboard } from '../controllers/parent_dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/data', authenticate, getParentDashboard);

export default router;
