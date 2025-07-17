import express from 'express';
import { create, getAll, getByUser } from '../controllers/playgroundLogController';
const router = express.Router();

router.post('/', create);
router.get('/', getAll);
router.get('/user/:userId', getByUser);

export default router; 