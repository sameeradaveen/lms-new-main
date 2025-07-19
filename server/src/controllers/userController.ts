import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

export const register = async (req: Request, res: Response) => {
  try {
    console.log('Register request received:', req.body);
    const { username, password, role } = req.body;
    
    if (!username || !password || !role) {
      console.log('Missing required fields:', { username: !!username, password: !!password, role: !!role });
      return res.status(400).json({ error: 'Username, password, and role are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log('User already exists:', username);
      return res.status(400).json({ error: 'Username already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    
    console.log('User created successfully:', { username, role });
    return res.status(201).json({ message: 'User created successfully', user: { username, role } });
  } catch (err) {
    console.error('Error in register:', err);
    return res.status(400).json({ error: (err as Error).message });
  }
};


export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return res.json({ token, user: { _id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const getAll = async (req: Request, res: Response) => {
  try {
    console.log('Get all users request received');
    const users = await User.find().select('-password');
    console.log('Found users:', users.length);
    return res.json(users);
  } catch (err) {
    console.error('Error in getAll:', err);
    return res.status(500).json({ error: (err as Error).message });
  }
};

export const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }
    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
    return res.json(user);
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
};

export const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    return res.json({ message: 'User deleted' });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}; 