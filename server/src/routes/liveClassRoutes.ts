import express from 'express';
import { create, getAll, getActive, update, toggleActive, remove } from '../controllers/liveClassController';
const router = express.Router();

router.post('/', create);
router.get('/', getAll);
router.get('/active', getActive);
router.put('/:id', update);
router.patch('/:id/toggle', toggleActive);
router.delete('/:id', remove);

export default router; 