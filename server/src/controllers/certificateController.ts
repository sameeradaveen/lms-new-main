import Certificate from '../models/Certificate';
import { Request, Response } from 'express';

export const generate = async (req: Request, res: Response) => {
  try {
    const cert = new Certificate(req.body);
    await cert.save();
    return res.status(201).json(cert);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const certs = await Certificate.find();
    return res.json(certs);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const getByUser = async (req: Request, res: Response) => {
  try {
    const certs = await Certificate.find({ user: req.params.userId });
    return res.json(certs);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const download = async (req: Request, res: Response) => {
  // Placeholder for PDF download logic
  return res.json({ message: 'Download not implemented yet' });
}; 