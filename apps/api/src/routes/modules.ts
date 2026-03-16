import { Router, Response } from 'express';
import Module from '../models/Module';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/modules
router.get('/', async (_req, res) => {
  try {
    const modules = await Module.find().sort({ order: 1 });
    res.json({ success: true, data: modules });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/modules/:id
router.get('/:id', async (req, res) => {
  try {
    const mod = await Module.findById(req.params.id);
    if (!mod) {
      res.status(404).json({ success: false, error: 'Module not found' });
      return;
    }
    res.json({ success: true, data: mod });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/modules
router.post('/', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mod = await Module.create(req.body);
    res.status(201).json({ success: true, data: mod });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(400).json({ success: false, error: message });
  }
});

// PUT /api/modules/:id
router.put('/:id', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const mod = await Module.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!mod) {
      res.status(404).json({ success: false, error: 'Module not found' });
      return;
    }
    res.json({ success: true, data: mod });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
