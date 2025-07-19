import Attendance from '../models/Attendance';
import { Request, Response } from 'express';

export const checkin = async (req: Request, res: Response) => {
  try {
    const { user, date, time } = req.body;
    
    // Check if user has already checked in today
    const today = new Date(date);
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    
    const existingRecord = await Attendance.findOne({
      user: user,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    
    if (existingRecord) {
      return res.status(400).json({ 
        error: 'You have already checked in today. Only one check-in per day is allowed.' 
      });
    }
    
    // Create new attendance record
    const record = new Attendance({ user, date, checkedIn: true, time });
    await record.save();
    return res.status(201).json({ 
      message: 'Attendance checked in successfully!',
      record 
    });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    const records = await Attendance.find().populate('user', 'username');
    return res.json(records);
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const getByUser = async (req: Request, res: Response) => {
  try {
    const records = await Attendance.find({ user: req.params.userId });
    return res.json(records);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const exportAttendance = async (req: Request, res: Response) => {
  try {
    const { startDate, endDate, format = 'csv' } = req.query;
    
    let query: any = {};
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate as string),
        $lte: new Date(endDate as string)
      };
    }

    const records = await Attendance.find(query).populate('user', 'username email');
    
    if (format === 'csv') {
      // Generate CSV content
      const csvHeader = 'Date,Username,Email,Time,Status\n';
      const csvContent = records.map(record => {
        const date = new Date(record.date).toLocaleDateString();
        const user = record.user as any;
        const username = user?.username || 'Unknown';
        const email = user?.email || 'Unknown';
        const time = record.time || 'N/A';
        const status = record.checkedIn ? 'Present' : 'Absent';
        return `${date},${username},${email},${time},${status}`;
      }).join('\n');
      
      const csvData = csvHeader + csvContent;
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
      return res.send(csvData);
    } else {
      // Return JSON format
      return res.json({
        totalRecords: records.length,
        records: records,
        exportDate: new Date().toISOString()
      });
    }
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }
}; 