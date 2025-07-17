import express from 'express';
import { generate, getAll, getByUser, download } from '../controllers/certificateController';
const router = express.Router();

router.post('/generate', generate);
router.get('/', getAll);
router.get('/user/:userId', getByUser);
router.get('/:id/download', download);

export default router; 