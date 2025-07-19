import express from 'express';
import { create, getAll, getByUser, getUnreadByUser, markAsRead, markAllAsRead, remove } from '../controllers/notificationController';
const router = express.Router();

router.post('/', create);
router.get('/', getAll);
router.get('/user/:userId', getByUser);
router.get('/user/:userId/unread', getUnreadByUser);
router.patch('/:id/read', markAsRead);
router.patch('/user/:userId/read-all', markAllAsRead);
router.delete('/:id', remove);

export default router; 