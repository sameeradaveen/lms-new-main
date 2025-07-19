import Submission from '../models/Submission';
import { Request, Response } from 'express';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const createSubmission = async (req: Request, res: Response) => {
  try {
    const { assignment, answerText, student } = req.body;
    const fileReq = req as MulterRequest;
    let fileUrl;
    if (fileReq.file) {
      fileUrl = `/uploads/${fileReq.file.filename}`;
    }
    const submission = new Submission({
      assignment,
      student,
      answerText,
      fileUrl,
    });
    await submission.save();
    return res.status(201).json(submission);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getSubmissionsByAssignment = async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find({ assignment: req.params.assignmentId });
    return res.json(submissions);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const getSubmissionsByStudent = async (req: Request, res: Response) => {
  try {
    const submissions = await Submission.find({ student: req.params.studentId });
    return res.json(submissions);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}; 