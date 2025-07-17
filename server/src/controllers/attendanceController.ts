import Attendance from '../models/Attendance';
import { Request, Response } from 'express';

export const checkin = async (req: Request, res: Response) => {
  try {
    const { user, date, time } = req.body;
    const record = new Attendance({ user, date, checkedIn: true, time });
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const records = await Attendance.find().populate('user', 'username');
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getByUser = async (req: Request, res: Response) => {
  try {
    const records = await Attendance.find({ user: req.params.userId });
    res.json(records);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const exportAttendance = async (req: Request, res: Response) => {
  // Placeholder for export logic
  res.json({ message: 'Export not implemented yet' });
}; 