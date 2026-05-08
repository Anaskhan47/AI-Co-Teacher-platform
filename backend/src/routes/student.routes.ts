import { Router } from 'express';
import { getStudentsByClass, getStudentsDetailed, createStudent } from '../controllers/student.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getStudentsByClass);
router.get('/roster', getStudentsDetailed);
router.post('/', authorize(['TEACHER', 'ADMIN']), createStudent);

export default router;
