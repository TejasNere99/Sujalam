import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.user_id;
    if (!userId) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Invalid user' } });
      return;
    }

    const user = await User.findById(userId).select('-password_hash');
    if (!user) {
      res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
      return;
    }

    res.json({ success: true, data: user });
  } catch (error: any) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

export default router;
