import Notification from '../models/Notification';
import { Request, Response } from 'express';

export const create = async (req: Request, res: Response) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getByUser = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ recipients: req.params.userId });
    res.json(notifications);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}; 