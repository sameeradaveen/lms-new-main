import Assignment from '../models/Assignment';
import Submission from '../models/Submission';
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export const createAssignment = async (req: Request, res: Response) => {
  try {
    console.log('📝 Assignment creation request received:', {
      body: req.body,
      files: (req as MulterRequest).file ? 'File present' : 'No file',
      timestamp: new Date().toISOString()
    });
    
    const { title, description, type, testCases } = req.body;
    const fileReq = req as MulterRequest;
    let pdfUrl;
    
    if (type === 'theory' && fileReq.file) {
      // Verify file was actually saved
      const filePath = fileReq.file.path;
      if (!fs.existsSync(filePath)) {
        console.error('❌ File upload failed - file not saved:', filePath);
        return res.status(500).json({ error: 'File upload failed - file not saved' });
      }
      
      pdfUrl = `/uploads/${fileReq.file.filename}`;
      console.log('📄 File uploaded successfully:', {
        originalName: fileReq.file.originalname,
        filename: fileReq.file.filename,
        size: fileReq.file.size,
        path: filePath,
        url: pdfUrl,
        uploadTime: new Date().toISOString()
      });
      
      // Verify file is accessible
      try {
        fs.accessSync(filePath, fs.constants.R_OK);
        console.log('✅ File permissions verified');
      } catch (err) {
        console.error('❌ File permission issue:', err);
        return res.status(500).json({ error: 'File permission issue after upload' });
      }
    }
    
    const assignment = new Assignment({
      title,
      description,
      type,
      pdfUrl,
      testCases: type === 'coding' && testCases ? JSON.parse(testCases) : [],
    });
    
    await assignment.save();
    console.log('✅ Assignment created successfully:', {
      id: assignment._id,
      title: assignment.title,
      pdfUrl: assignment.pdfUrl,
      timestamp: new Date().toISOString()
    });
    return res.status(201).json(assignment);
  } catch (err) {
    console.error('❌ Error creating assignment:', err);
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getAllAssignments = async (req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find();
    
    // Clean up orphaned file references
    const cleanedAssignments = assignments.map(assignment => {
      if (assignment.pdfUrl) {
        const filename = assignment.pdfUrl.replace('/uploads/', '');
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
        if (!fs.existsSync(filePath)) {
          // File doesn't exist, remove the reference
          assignment.pdfUrl = null;
          assignment.save().catch(err => console.error('Failed to update assignment:', err));
        }
      }
      return assignment;
    });
    
    return res.json(cleanedAssignments);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const getAssignmentById = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    return res.json(assignment);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const deleteAssignment = async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findByIdAndDelete(req.params.id);
    if (!assignment) return res.status(404).json({ error: 'Assignment not found' });
    // Delete PDF if present
    if (assignment.pdfUrl) {
      const pdfPath = path.join(__dirname, '../../', assignment.pdfUrl);
      fs.unlink(pdfPath, err => { if (err) console.error('Failed to delete PDF:', err); });
    }
    // Delete all submissions for this assignment
    const submissions = await Submission.find({ assignment: req.params.id });
    for (const sub of submissions) {
      if (sub.fileUrl) {
        const filePath = path.join(__dirname, '../../', sub.fileUrl);
        fs.unlink(filePath, err => { if (err) console.error('Failed to delete submission file:', err); });
      }
      await sub.deleteOne();
    }
    return res.json({ message: 'Assignment and related submissions deleted' });
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const downloadAssignmentFile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { filename } = req.params;
    
    if (!filename) {
      res.status(400).json({ error: 'Filename is required' });
      return;
    }
    
    const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      res.status(404).json({ error: 'File not found' });
      return;
    }
    
    // Set appropriate headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Type', 'application/octet-stream');
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
};

export const cleanupOrphanedFiles = async (req: Request, res: Response): Promise<void> => {
  try {
    const assignments = await Assignment.find({ pdfUrl: { $exists: true, $ne: null } });
    let cleanedCount = 0;
    
    for (const assignment of assignments) {
      if (assignment.pdfUrl) {
        const filename = assignment.pdfUrl.replace('/uploads/', '');
        const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
        
        if (!fs.existsSync(filePath)) {
          assignment.pdfUrl = null;
          await assignment.save();
          cleanedCount++;
        }
      }
    }
    
    res.json({ 
      message: `Cleanup completed. Removed ${cleanedCount} orphaned file references.`,
      cleanedCount 
    });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}; 