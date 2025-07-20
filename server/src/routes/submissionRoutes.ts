import express from 'express';
import { createSubmission, getSubmissionsByAssignment, getSubmissionsByStudent, downloadFile } from '../controllers/submissionController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ dest: uploadsDir });
const router = express.Router();

router.post('/', upload.single('file'), createSubmission);
router.get('/assignment/:assignmentId', getSubmissionsByAssignment);
router.get('/student/:studentId', getSubmissionsByStudent);
router.get('/download/:filename', downloadFile);

export default router; 