import LiveClassLink from '../models/LiveClassLink';
import { Request, Response } from 'express';

export const create = async (req: Request, res: Response) => {
  try {
    const link = new LiveClassLink(req.body);
    await link.save();
    res.status(201).json(link);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const links = await LiveClassLink.find();
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getActive = async (req: Request, res: Response) => {
  try {
    const links = await LiveClassLink.find({ active: true });
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await LiveClassLink.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
}; 