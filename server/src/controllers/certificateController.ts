import Certificate from '../models/Certificate';
import { Request, Response } from 'express';

export const generate = async (req: Request, res: Response) => {
  try {
    const cert = new Certificate(req.body);
    await cert.save();
    res.status(201).json(cert);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const certs = await Certificate.find();
    res.json(certs);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const getByUser = async (req: Request, res: Response) => {
  try {
    const certs = await Certificate.find({ user: req.params.userId });
    res.json(certs);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

export const download = async (req: Request, res: Response) => {
  // Placeholder for PDF download logic
  res.json({ message: 'Download not implemented yet' });
}; 