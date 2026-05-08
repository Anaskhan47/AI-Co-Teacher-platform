import { Router } from 'express';
import { getMetadata, getBoards } from '../controllers/curriculum.controller';

const router = Router();

router.get('/metadata', getMetadata);
router.get('/boards', getBoards);

export default router;
