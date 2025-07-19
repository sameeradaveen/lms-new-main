import Assignment from '../models/Assignment';
import Submission from '../models/Submission';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const createAssignment = async (req: Request, res: Response) => {
  try {
    const { title, description, type, testCases } = req.body;
    const fileReq = req as MulterRequest;
    let pdfUrl;
    if (type === 'theory' && fileReq.file) {
      pdfUrl = `/uploads/${fileReq.file.filename}`;
    }
    const assignment = new Assignment({
      title,
      description,
      type,
      pdfUrl,
      testCases: type === 'coding' && testCases ? JSON.parse(testCases) : [],
    });
    await assignment.save();
    return res.status(201).json(assignment);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getAllAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find();
    return res.json(assignments);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    return res.json(assignment);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    // Delete PDF if present
    if (assignment.pdfUrl) {
      const pdfPath = path.join(__dirname, '../../', assignment.pdfUrl);
      fs.unlink(pdfPath, err => { if (err) console.error('Failed to delete PDF:', err); });
    }
    // Delete all submissions for this assignment
    const submissions = await Submission.find({ assignment: req.params.id });
    for (const sub of submissions) {
      if (sub.fileUrl) {
        const filePath = path.join(__dirname, '../../', sub.fileUrl);
        fs.unlink(filePath, err => { if (err) console.error('Failed to delete submission file:', err); });
      }
      await sub.deleteOne();
    }
    return res.json({ message: 'Assignment and related submissions deleted' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}; 