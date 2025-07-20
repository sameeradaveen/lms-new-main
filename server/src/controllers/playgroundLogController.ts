import PlaygroundLog from '../models/PlaygroundLog';
import { Request, Response } from 'express';

export const create = async (req: Request, res: Response) => {
  try {
    const log = new PlaygroundLog(req.body);
    await log.save();
    return res.status(201).json(log);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const logs = await PlaygroundLog.find();
    return res.json(logs);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const getByUser = async (req: Request, res: Response) => {
  try {
    const logs = await PlaygroundLog.find({ user: req.params.userId });
    return res.json(logs);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const deleteByUser = async (req: Request, res: Response) => {
  try {
    const result = await PlaygroundLog.deleteMany({ user: req.params.userId });
    return res.json({ 
      message: `Deleted ${result.deletedCount} playground logs for user ${req.params.userId}`,
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}; 