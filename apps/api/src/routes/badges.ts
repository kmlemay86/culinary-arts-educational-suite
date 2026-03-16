import { Router, Response } from 'express';
import { Badge, EarnedBadge } from '../models/Badge';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/badges
router.get('/', async (_req, res) => {
  try {
    const badges = await Badge.find();
    res.json({ success: true, data: badges });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/badges/earned (current user)
router.get('/earned', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const earned = await EarnedBadge.find({ userId: req.user!.id }).populate('badgeId');
    res.json({ success: true, data: earned });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
