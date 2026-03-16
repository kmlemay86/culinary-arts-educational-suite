import { Router, Response } from 'express';
import Lesson from '../models/Lesson';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/lessons?moduleId=...
router.get('/', async (req, res) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.moduleId) filter.moduleId = req.query.moduleId;
    const lessons = await Lesson.find(filter).sort({ order: 1 });
    res.json({ success: true, data: lessons });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/lessons/:id
router.get('/:id', async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      res.status(404).json({ success: false, error: 'Lesson not found' });
      return;
    }
    res.json({ success: true, data: lesson });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/lessons
router.post('/', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lesson = await Lesson.create({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ success: true, data: lesson });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(400).json({ success: false, error: message });
  }
});

// PUT /api/lessons/:id
router.put('/:id', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lesson) {
      res.status(404).json({ success: false, error: 'Lesson not found' });
      return;
    }
    res.json({ success: true, data: lesson });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// DELETE /api/lessons/:id
router.delete('/:id', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Lesson deleted' });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/lessons/:id/complete
router.post('/:id/complete', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { LessonCompletion } = await import('../models/Progress');
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      res.status(404).json({ success: false, error: 'Lesson not found' });
      return;
    }
    await LessonCompletion.findOneAndUpdate(
      { userId: req.user!.id, lessonId: lesson._id },
      { userId: req.user!.id, lessonId: lesson._id, moduleId: lesson.moduleId, completedAt: new Date() },
      { upsert: true, new: true }
    );
    res.json({ success: true, message: 'Lesson marked complete' });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
