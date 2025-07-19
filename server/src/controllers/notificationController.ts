import Notification from '../models/Notification';
import { Request, Response } from 'express';

export const create = async (req: Request, res: Response) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    return res.status(201).json(notification);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find()
      .populate('createdBy', 'username')
      .populate('recipients', 'username')
      .sort({ createdAt: -1 });
    return res.json(notifications);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const getByUser = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ 
      recipients: req.params.userId,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    return res.json(notifications);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getUnreadByUser = async (req: Request, res: Response) => {
  try {
    const notifications = await Notification.find({ 
      recipients: req.params.userId,
      isRead: false,
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: new Date() } }
      ]
    })
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 });
    return res.json(notifications);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id, 
      { isRead: true }, 
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    return res.json(notification);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await Notification.updateMany(
      { recipients: userId, isRead: false },
      { isRead: true }
    );
    return res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Notification deleted successfully' });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}; 