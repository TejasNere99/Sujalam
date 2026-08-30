import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Refusing to start.');
}
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !password) {
      res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Name and password are required' } });
      return;
    }

    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ success: false, error: { code: 'USER_EXISTS', message: 'Email already registered' } });
        return;
      }
    }

    const password_hash = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phone, password_hash });
    await newUser.save();

    res.status(201).json({ success: true, data: { _id: newUser._id, name: newUser.name, email: newUser.email } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'Email and password required' } });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid credentials' } });
      return;
    }

    const token = jwt.sign({ user_id: user._id.toString() }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    res.json({ success: true, data: { token, user: { _id: user._id, name: user.name, email: user.email } } });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

router.post('/logout', (req: Request, res: Response) => {
  res.json({ success: true, data: { message: 'Logged out successfully' } });
});

export default router;
