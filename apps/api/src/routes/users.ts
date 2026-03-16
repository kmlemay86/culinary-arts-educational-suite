import { Router, Response } from 'express';
import User from '../models/User';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { UserRole } from '@culinary/shared';

const router = Router();

// GET /api/users (admin only)
router.get('/', authenticate, authorize('admin'), async (_req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// PUT /api/users/:id/role (admin only)
router.put('/:id/role', authenticate, authorize('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { role } = req.body as { role: UserRole };
    if (!['student', 'instructor', 'admin'].includes(role)) {
      res.status(400).json({ success: false, error: 'Invalid role' });
      return;
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) {
      res.status(404).json({ success: false, error: 'User not found' });
      return;
    }
    res.json({ success: true, data: user });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE /api/users/:id (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
