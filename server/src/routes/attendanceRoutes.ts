import express from 'express';
import { checkin, getAll, getByUser, exportAttendance } from '../controllers/attendanceController';
const router = express.Router();

router.post('/checkin', checkin);
router.get('/', getAll);
router.get('/user/:userId', getByUser);
router.get('/export', exportAttendance);

export default router; 