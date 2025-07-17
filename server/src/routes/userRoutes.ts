import express from 'express';
import { register, login, getAll, update, remove } from '../controllers/userController';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', getAll);
router.put('/:id', update);
router.delete('/:id', remove);

export default router; 