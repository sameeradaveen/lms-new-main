import CourseModule from '../models/CourseModule';
import { Request, Response } from 'express';
import { Multer } from 'multer';
import fs from 'fs';
import path from 'path';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const create = async (req: Request, res: Response) => {
  try {
    const { title, description, track } = req.body;
    const fileReq = req as MulterRequest;
    const pdfUrl = fileReq.file ? `/uploads/${fileReq.file.filename}` : undefined;
    const course = new CourseModule({ title, description, track, pdfUrl });
    await course.save();
    return res.status(201).json(course);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const modules = await CourseModule.find();
    return res.json(modules);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const getById = async (req: Request, res: Response) => {
  try {
    const module = await CourseModule.findById(req.params.id);
    if (!module) return res.status(404).json({ error: 'Not found' });
    return res.json(module);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const module = await CourseModule.findByIdAndUpdate(req.params.id, req.body, { new: true });
    return res.json(module);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    await CourseModule.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Deleted' });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const deletePdf = async (req: Request, res: Response) => {
  try {
    const course = await CourseModule.findById(req.params.id);
    if (!course || !course.pdfUrl) {
      return res.status(404).json({ error: 'PDF not found for this course' });
    }
    // Remove leading slash and resolve path
    const filePath = path.join(__dirname, '../../', course.pdfUrl);
    fs.unlink(filePath, (err) => {
      if (err) console.error('Failed to delete PDF:', err);
    });
    course.pdfUrl = null;
    await course.save();
    return res.json({ message: 'PDF deleted' });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}; 