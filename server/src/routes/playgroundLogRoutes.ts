import express from 'express';
import { create, getAll, getByUser, deleteByUser } from '../controllers/playgroundLogController';
const router = express.Router();

router.post('/', create);
router.get('/', getAll);
router.get('/user/:userId', getByUser);
router.delete('/user/:userId', deleteByUser);

export default router; 