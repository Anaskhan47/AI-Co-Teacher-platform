import { Router } from 'express';
import { getStudentDashboard, getStudentAssignments, submitAssignment } from '../controllers/student_dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/dashboard', getStudentDashboard);
router.get('/assignments', getStudentAssignments);
router.post('/assignments/submit', submitAssignment);

export default router;
