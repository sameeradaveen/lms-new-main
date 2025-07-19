import LiveClassLink from '../models/LiveClassLink';
import { Request, Response } from 'express';

export const create = async (req: Request, res: Response) => {
  try {
    const link = new LiveClassLink(req.body);
    await link.save();
    return res.status(201).json(link);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const links = await LiveClassLink.find().populate('createdBy', 'username');
    return res.json(links);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const getActive = async (req: Request, res: Response) => {
  try {
    const now = new Date();
    const links = await LiveClassLink.find({ 
      active: true,
      $or: [
        { autoHide: false },
        {
          autoHide: true,
          createdAt: { 
            $gte: new Date(now.getTime() - (24 * 60 * 60 * 1000)) // Show links created within last 24 hours
          }
        }
      ]
    }).populate('createdBy', 'username');
    return res.json(links);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const link = await LiveClassLink.findByIdAndUpdate(id, req.body, { new: true });
    if (!link) return res.status(404).json({ error: 'Live class link not found' });
    return res.json(link);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const toggleActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const link = await LiveClassLink.findById(id);
    if (!link) return res.status(404).json({ error: 'Live class link not found' });
    
    link.active = !link.active;
    await link.save();
    return res.json(link);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await LiveClassLink.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Live class link deleted successfully' });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}; 