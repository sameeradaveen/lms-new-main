import express from 'express';
import { createAssignment, getAllAssignments, getAssignmentById, deleteAssignment, downloadAssignmentFile, cleanupOrphanedFiles } from '../controllers/assignmentController';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer with better error handling
const upload = multer({ 
  dest: uploadsDir,
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

const router = express.Router();

// Error handling middleware for multer
const handleMulterError = (err: any, req: express.Request, res: express.Response, next: express.NextFunction): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
      return;
    }
    res.status(400).json({ error: err.message });
    return;
  } else if (err) {
    res.status(400).json({ error: err.message });
    return;
  }
  next();
};

router.post('/', upload.single('pdf'), handleMulterError, createAssignment);
router.get('/', getAllAssignments);
router.get('/:id', getAssignmentById);
router.delete('/:id', deleteAssignment);
router.get('/download/:filename', downloadAssignmentFile);
router.post('/cleanup', cleanupOrphanedFiles);

export default router; 