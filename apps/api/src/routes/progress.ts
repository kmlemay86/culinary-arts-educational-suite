import { Router, Response } from 'express';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import Module from '../models/Module';
import Lesson from '../models/Lesson';
import { Quiz, QuizAttempt } from '../models/Quiz';
import { GameAttempt } from '../models/Game';
import { LessonCompletion } from '../models/Progress';
import { EarnedBadge } from '../models/Badge';

const router = Router();

async function getStudentProgress(userId: string) {
  const [modules, earnedBadges, quizAttempts, gameAttempts] = await Promise.all([
    Module.find().sort({ order: 1 }),
    EarnedBadge.find({ userId }).populate('badgeId'),
    QuizAttempt.find({ userId }),
    GameAttempt.find({ userId }),
  ]);

  const moduleProgress = await Promise.all(modules.map(async (mod) => {
    const [lessons, quizzes, completions] = await Promise.all([
      Lesson.find({ moduleId: mod._id }),
      Quiz.find({ moduleId: mod._id }),
      LessonCompletion.find({ userId, moduleId: mod._id }),
    ]);
    const quizIds = quizzes.map(q => String(q._id));
    const passedQuizzes = quizAttempts.filter(a => quizIds.includes(String(a.quizId)) && a.passed);
    const uniquePassed = new Set(passedQuizzes.map(a => String(a.quizId)));
    const lessonsCompleted = completions.length;
    const lessonsTotal = lessons.length;
    const quizzesPassed = uniquePassed.size;
    const quizzesTotal = quizzes.length;
    const completed = lessonsTotal > 0 && lessonsCompleted >= lessonsTotal;
    return {
      moduleId: String(mod._id),
      moduleCode: mod.code,
      moduleTitle: mod.title,
      lessonsCompleted,
      lessonsTotal,
      quizzesPassed,
      quizzesTotal,
      completed,
    };
  }));

  const completedModules = moduleProgress.filter(m => m.completed).length;
  const overallCompletion = modules.length > 0
    ? Math.round((completedModules / modules.length) * 100)
    : 0;

  return {
    userId,
    modules: moduleProgress,
    overallCompletion,
    badgesEarned: earnedBadges.length,
    quizzesTaken: new Set(quizAttempts.map(a => String(a.quizId))).size,
    gamesPlayed: new Set(gameAttempts.map(a => String(a.gameId))).size,
  };
}

// GET /api/progress/me
router.get('/me', authenticate, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const progress = await getStudentProgress(req.user!.id);
    res.json({ success: true, data: progress });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/progress/students (instructor/admin)
router.get('/students', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const User = (await import('../models/User')).default;
    const students = await User.find({ role: 'student' });
    const summaries = await Promise.all(students.map(async (s) => {
      const progress = await getStudentProgress(String(s._id));
      return {
        user: { _id: s._id, name: s.name, email: s.email },
        overallCompletion: progress.overallCompletion,
        badgesEarned: progress.badgesEarned,
        quizzesTaken: progress.quizzesTaken,
        gamesPlayed: progress.gamesPlayed,
      };
    }));
    res.json({ success: true, data: summaries });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// GET /api/progress/students/:userId
router.get('/students/:userId', authenticate, authorize('instructor', 'admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const progress = await getStudentProgress(req.params.userId);
    res.json({ success: true, data: progress });
  } catch {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
