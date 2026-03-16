import { Router, Response } from 'express';
import Recipe from '../models/Recipe';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/recipes?search=...&tag=...
router.get('/', async (req, res) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.search) {
      filter.$text = { $search: req.query.search as string };
    }
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.moduleId) filter.moduleId = req.query.moduleId;
    const recipes = await Recipe.find(filter).sort({ title: 1 });
    res.json({ success: true, data: recipes });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/recipes/:id
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      res.status(404).json({ success: false, error: 'Recipe not found' });
      return;
    }
    res.json({ success: true, data: recipe });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/recipes
router.post('/', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recipe = await Recipe.create({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ success: true, data: recipe });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(400).json({ success: false, error: message });
  }
});

// PUT /api/recipes/:id
router.put('/:id', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!recipe) {
      res.status(404).json({ success: false, error: 'Recipe not found' });
      return;
    }
    res.json({ success: true, data: recipe });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE /api/recipes/:id
router.delete('/:id', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Recipe deleted' });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
