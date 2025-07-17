import express from 'express';
import { create, getAll, getActive, remove } from '../controllers/liveClassController';
const router = express.Router();

router.post('/', create);
router.get('/', getAll);
router.get('/active', getActive);
router.delete('/:id', remove);

export default router; 