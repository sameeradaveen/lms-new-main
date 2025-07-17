import express from 'express';
import { createAssignment, getAllAssignments, getAssignmentById, deleteAssignment } from '../controllers/assignmentController';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', upload.single('pdf'), createAssignment);
router.get('/', getAllAssignments);
router.get('/:id', getAssignmentById);
router.delete('/:id', deleteAssignment);

export default router; 