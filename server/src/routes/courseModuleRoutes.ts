import express from 'express';
import { create, getAll, getById, update, remove, deletePdf } from '../controllers/courseModuleController';
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

router.post('/', upload.single('pdf'), create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);
router.delete('/:id/pdf', deletePdf);

export default router; 