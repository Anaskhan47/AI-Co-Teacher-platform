import { Router } from 'express';
import { getStudentsByClass, markAttendance, getAttendanceHistory } from '../controllers/attendance.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/students', getStudentsByClass);
router.post('/mark', markAttendance);
router.get('/history', getAttendanceHistory);

export default router;
