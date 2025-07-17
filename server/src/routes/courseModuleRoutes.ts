import express from 'express';
import { create, getAll, getById, update, remove, deletePdf } from '../controllers/courseModuleController';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/', upload.single('pdf'), create);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);
router.delete('/:id/pdf', deletePdf);

export default router; 