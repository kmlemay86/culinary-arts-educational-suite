import { Badge, EarnedBadge } from '../models/Badge';

export async function awardBadge(userId: string, badgeId: string): Promise<void> {
  try {
    await EarnedBadge.findOneAndUpdate(
      { userId, badgeId },
      { userId, badgeId, earnedAt: new Date() },
      { upsert: true }
    );
  } catch { /* ignore duplicate key errors */ }
}

export async function awardBadgesForQuiz(
  userId: string,
  quizId: string,
  score: number,
  passed: boolean
): Promise<void> {
  const badges = await Badge.find({
    $or: [
      { 'criteria.trigger': 'quiz_pass', 'criteria.quizId': quizId },
      { 'criteria.trigger': 'quiz_score', 'criteria.quizId': quizId },
      { 'criteria.trigger': 'quiz_pass' },
      { 'criteria.trigger': 'quiz_score' },
    ],
  });
  for (const badge of badges) {
    if (badge.criteria.trigger === 'quiz_pass' && passed) {
      if (!badge.criteria.quizId || String(badge.criteria.quizId) === quizId) {
        await awardBadge(userId, String(badge._id));
      }
    } else if (badge.criteria.trigger === 'quiz_score' && badge.criteria.minScore !== undefined) {
      if (score >= badge.criteria.minScore) {
        if (!badge.criteria.quizId || String(badge.criteria.quizId) === quizId) {
          await awardBadge(userId, String(badge._id));
        }
      }
    }
  }
}

export async function awardBadgesForGame(userId: string, gameId: string): Promise<void> {
  const badges = await Badge.find({
    'criteria.trigger': 'game_complete',
    $or: [
      { 'criteria.gameId': gameId },
      { 'criteria.gameId': { $exists: false } },
    ],
  });
  for (const badge of badges) {
    await awardBadge(userId, String(badge._id));
  }
}

export async function awardBadgesForModuleComplete(userId: string, moduleId: string): Promise<void> {
  const badges = await Badge.find({
    'criteria.trigger': 'module_complete',
    $or: [
      { 'criteria.moduleId': moduleId },
      { 'criteria.moduleId': { $exists: false } },
    ],
  });
  for (const badge of badges) {
    await awardBadge(userId, String(badge._id));
  }
}
