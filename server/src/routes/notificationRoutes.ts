import express from 'express';
import { create, getAll, getByUser, remove } from '../controllers/notificationController';
const router = express.Router();

router.post('/', create);
router.get('/', getAll);
router.get('/user/:userId', getByUser);
router.delete('/:id', remove);

export default router; 