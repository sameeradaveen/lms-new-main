import express from 'express';
import { createSubmission, getSubmissionsByAssignment, getSubmissionsByStudent } from '../controllers/submissionController';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', upload.single('file'), createSubmission);
router.get('/assignment/:assignmentId', getSubmissionsByAssignment);
router.get('/student/:studentId', getSubmissionsByStudent);

export default router; 