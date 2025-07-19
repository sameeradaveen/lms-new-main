import express from 'express';
import { executeCode } from '../controllers/codeExecutionController';
const router = express.Router();

router.post('/execute', executeCode);

export default router; 