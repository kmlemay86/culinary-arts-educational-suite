import { Router, Response } from 'express';
import { Game, GameAttempt } from '../models/Game';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/games
router.get('/', async (_req, res) => {
  try {
    const games = await Game.find();
    res.json({ success: true, data: games });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/games/:slug
router.get('/:slug', async (req, res) => {
  try {
    const game = await Game.findOne({ slug: req.params.slug });
    if (!game) {
      res.status(404).json({ success: false, error: 'Game not found' });
      return;
    }
    res.json({ success: true, data: game });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/games/:slug/attempt
router.post('/:slug/attempt', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const game = await Game.findOne({ slug: req.params.slug });
    if (!game) {
      res.status(404).json({ success: false, error: 'Game not found' });
      return;
    }
    const { score, details } = req.body as { score: number; details?: Record<string, unknown> };
    const attempt = await GameAttempt.create({
      gameId: game._id,
      userId: req.user!.id,
      score,
      maxScore: game.maxScore,
      details,
    });

    // Check badge criteria
    try {
      const { awardBadgesForGame } = await import('../services/badges');
      await awardBadgesForGame(String(req.user!.id), String(game._id));
    } catch { /* badge errors should not fail game submission */ }

    res.json({ success: true, data: attempt });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/games/:slug/attempts (user's own attempts)
router.get('/:slug/attempts', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const game = await Game.findOne({ slug: req.params.slug });
    if (!game) {
      res.status(404).json({ success: false, error: 'Game not found' });
      return;
    }
    const attempts = await GameAttempt.find({ gameId: game._id, userId: req.user!.id })
      .sort({ completedAt: -1 }).limit(10);
    res.json({ success: true, data: attempts });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
