import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import type { Module, Lesson, Quiz } from '@culinary/shared';
import { useAuth } from '../contexts/AuthContext';

export default function ModuleDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [mod, setMod] = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [tab, setTab] = useState<'objectives' | 'lessons' | 'quizzes'>('objectives');

  useEffect(() => {
    if (!id) return;
    Promise.all([
      client.get(`/modules/${id}`),
      client.get(`/lessons?moduleId=${id}`),
      client.get(`/quizzes?moduleId=${id}`),
    ]).then(([mRes, lRes, qRes]) => {
      setMod(mRes.data.data);
      setLessons(lRes.data.data);
      setQuizzes(qRes.data.data);
    });
  }, [id]);

  if (!mod) return <div className="flex justify-center p-16"><div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full"/></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-culinary-brown text-white rounded-2xl flex items-center justify-center text-2xl font-black flex-shrink-0">
          {mod.code}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-culinary-brown">{mod.title}</h1>
          <p className="text-gray-600 mt-1">{mod.description}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 flex gap-4">
        {(['objectives', 'lessons', 'quizzes'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors capitalize ${
              tab === t ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t} {t === 'objectives' ? `(${mod.objectives.length})` : t === 'lessons' ? `(${lessons.length})` : `(${quizzes.length})`}
          </button>
        ))}
      </div>

      {tab === 'objectives' && (
        <div className="space-y-3">
          {mod.objectives.map((obj) => (
            <div key={obj._id || obj.code} className="flex items-start gap-3 bg-white rounded-lg p-4 border border-gray-100">
              <span className="bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded flex-shrink-0">{obj.code}</span>
              <p className="text-gray-700 text-sm">{obj.description}</p>
            </div>
          ))}
        </div>
      )}

      {tab === 'lessons' && (
        <div className="space-y-3">
          {lessons.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">📝</div>
              <p>No lessons yet for this module.</p>
              {(user?.role === 'instructor' || user?.role === 'admin') && (
                <Link to="/instructor/lessons/new" className="btn-primary mt-4 inline-block">Add First Lesson</Link>
              )}
            </div>
          )}
          {lessons.map(lesson => (
            <Link key={lesson._id} to={`/lessons/${lesson._id}`}
              className="block bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <div>
                  <h3 className="font-semibold">{lesson.title}</h3>
                  {lesson.videoUrl && <span className="text-xs text-blue-500">🎬 Has video</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === 'quizzes' && (
        <div className="space-y-3">
          {quizzes.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <div className="text-4xl mb-2">🧠</div>
              <p>No quizzes yet for this module.</p>
            </div>
          )}
          {quizzes.map(quiz => (
            <Link key={quiz._id} to={`/quizzes/${quiz._id}`}
              className="block bg-white rounded-lg p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🧠</span>
                  <div>
                    <h3 className="font-semibold">{quiz.title}</h3>
                    <p className="text-xs text-gray-500">{quiz.questions.length} questions · Passing: {quiz.passingScore}%</p>
                  </div>
                </div>
                <span className="btn-primary text-sm">Take Quiz</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
