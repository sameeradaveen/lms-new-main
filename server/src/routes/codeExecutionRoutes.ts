import express from 'express';
import { executeCode, getAvailableRuntimes } from '../controllers/codeExecutionController';
const router = express.Router();

router.post('/execute', executeCode);
router.get('/runtimes', getAvailableRuntimes);

export default router; 