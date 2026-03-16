import { useEffect, useState } from 'react';
import client from '../api/client';
import type { StudentProgress, EarnedBadge, Badge } from '@culinary/shared';

export default function Progress() {
  const [progress, setProgress] = useState<StudentProgress | null>(null);
  const [badges, setBadges] = useState<EarnedBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      client.get('/progress/me'),
      client.get('/badges/earned'),
    ]).then(([pRes, bRes]) => {
      setProgress(pRes.data.data);
      setBadges(bRes.data.data);
      setLoading(false);
    });
  }, []);

  if (loading || !progress) return <div className="flex justify-center p-16"><div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full"/></div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-culinary-brown">📊 My Progress</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Overall Completion', value: `${progress.overallCompletion}%`, icon: '🎯' },
          { label: 'Badges Earned', value: progress.badgesEarned, icon: '🏆' },
          { label: 'Quizzes Taken', value: progress.quizzesTaken, icon: '🧠' },
          { label: 'Games Played', value: progress.gamesPlayed, icon: '🎮' },
        ].map(s => (
          <div key={s.label} className="card text-center">
            <div className="text-3xl mb-1">{s.icon}</div>
            <div className="text-2xl font-black text-primary-600">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="card">
        <h2 className="font-bold mb-3">Course Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div className="bg-primary-500 h-4 rounded-full transition-all" style={{ width: `${progress.overallCompletion}%` }}/>
        </div>
        <p className="text-sm text-gray-500 mt-2">{progress.overallCompletion}% complete</p>
        {progress.overallCompletion >= 80 && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-3xl">🎓</div>
            <p className="font-bold text-green-700 mt-1">Congratulations! You have completed the course!</p>
          </div>
        )}
      </div>

      {/* Module progress */}
      <div>
        <h2 className="text-xl font-bold mb-4">Module Progress</h2>
        <div className="space-y-3">
          {progress.modules.map(m => (
            <div key={m.moduleId} className={`card flex items-center gap-4 ${m.completed ? 'border-green-200 bg-green-50' : ''}`}>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black flex-shrink-0 ${m.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {m.completed ? '✓' : m.moduleCode}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{m.moduleTitle}</p>
                <div className="flex gap-4 text-xs text-gray-500 mt-0.5">
                  <span>{m.lessonsCompleted}/{m.lessonsTotal} lessons</span>
                  <span>{m.quizzesPassed}/{m.quizzesTotal} quizzes passed</span>
                </div>
              </div>
              {m.lessonsTotal > 0 && (
                <div className="w-24 bg-gray-200 rounded-full h-2 flex-shrink-0">
                  <div className="bg-primary-500 h-2 rounded-full" 
                    style={{ width: `${m.lessonsTotal > 0 ? Math.round((m.lessonsCompleted / m.lessonsTotal) * 100) : 0}%` }}/>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div>
        <h2 className="text-xl font-bold mb-4">🏆 Earned Badges</h2>
        {badges.length === 0 ? (
          <div className="card text-center text-gray-400">
            <div className="text-4xl mb-2">🎖️</div>
            <p>Complete lessons, quizzes, and games to earn badges!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {badges.map(eb => {
              const badge = eb.badge as Badge | undefined;
              return (
                <div key={eb._id} className="card text-center">
                  <div className="text-4xl mb-2">{badge?.imageUrl || '🏅'}</div>
                  <p className="font-bold text-sm">{badge?.title || 'Badge'}</p>
                  <p className="text-xs text-gray-500 mt-1">{badge?.description}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(eb.earnedAt).toLocaleDateString()}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
