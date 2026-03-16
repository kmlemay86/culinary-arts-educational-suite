import { Router, Response } from 'express';
import { Quiz, QuizAttempt } from '../models/Quiz';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /api/quizzes?moduleId=...
router.get('/', async (req, res) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.moduleId) filter.moduleId = req.query.moduleId;
    const quizzes = await Quiz.find(filter);
    res.json({ success: true, data: quizzes });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/quizzes/:id
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      res.status(404).json({ success: false, error: 'Quiz not found' });
      return;
    }
    res.json({ success: true, data: quiz });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/quizzes
router.post('/', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.create({ ...req.body, createdBy: req.user!.id });
    res.status(201).json({ success: true, data: quiz });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Server error';
    res.status(400).json({ success: false, error: message });
  }
});

// PUT /api/quizzes/:id
router.put('/:id', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!quiz) {
      res.status(404).json({ success: false, error: 'Quiz not found' });
      return;
    }
    res.json({ success: true, data: quiz });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// POST /api/quizzes/:id/attempt
router.post('/:id/attempt', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      res.status(404).json({ success: false, error: 'Quiz not found' });
      return;
    }
    const { answers } = req.body as { answers: number[] };
    if (!Array.isArray(answers) || answers.length !== quiz.questions.length) {
      res.status(400).json({ success: false, error: 'Invalid answers array' });
      return;
    }
    let correct = 0;
    const feedback = quiz.questions.map((q, i) => {
      const isCorrect = answers[i] === q.correctIndex;
      if (isCorrect) correct++;
      return { correct: isCorrect, correctIndex: q.correctIndex, explanation: q.explanation };
    });
    const score = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;
    const attempt = await QuizAttempt.create({
      quizId: quiz._id,
      userId: req.user!.id,
      answers,
      score,
      passed,
    });

    // Check badge criteria
    try {
      const { awardBadgesForQuiz } = await import('../services/badges');
      await awardBadgesForQuiz(String(req.user!.id), String(quiz._id), score, passed);
    } catch { /* badge errors should not fail quiz submission */ }

    res.json({ success: true, data: { attempt, feedback, score, passed } });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/quizzes/:id/attempts
router.get('/:id/attempts', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const attempts = await QuizAttempt.find({
      quizId: req.params.id,
      userId: req.user!.id,
    }).sort({ completedAt: -1 });
    res.json({ success: true, data: attempts });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
