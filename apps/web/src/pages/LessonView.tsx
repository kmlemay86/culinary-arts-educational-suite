import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import client from '../api/client';
import type { Lesson } from '@culinary/shared';
import { useAuth } from '../contexts/AuthContext';

export default function LessonView() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!id) return;
    client.get(`/lessons/${id}`).then(res => setLesson(res.data.data));
  }, [id]);

  const markComplete = async () => {
    if (!user || !id) return;
    await client.post(`/lessons/${id}/complete`);
    setCompleted(true);
  };

  if (!lesson) return <div className="flex justify-center p-16"><div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full"/></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link to={`/modules/${lesson.moduleId}`} className="text-primary-600 text-sm hover:underline">← Back to Module</Link>
        {user && !completed && (
          <button onClick={markComplete} className="btn-primary text-sm">✓ Mark Complete</button>
        )}
        {completed && <span className="text-green-600 font-medium text-sm">✅ Completed!</span>}
      </div>
      <h1 className="text-3xl font-bold text-culinary-brown">{lesson.title}</h1>
      {lesson.videoUrl && (
        <div className="bg-gray-900 rounded-xl overflow-hidden aspect-video flex items-center justify-center">
          <a href={lesson.videoUrl} target="_blank" rel="noopener noreferrer"
            className="text-white text-center p-8 hover:text-primary-300 transition-colors">
            <div className="text-6xl mb-2">▶️</div>
            <p className="text-lg font-semibold">Watch Video</p>
            <p className="text-sm text-gray-400 mt-1">{lesson.videoUrl}</p>
          </a>
        </div>
      )}
      {lesson.imageUrl && (
        <img src={lesson.imageUrl} alt={lesson.title} className="w-full rounded-xl object-cover max-h-64" />
      )}
      <div className="card prose prose-slate max-w-none">
        <ReactMarkdown>{lesson.content || '*No content yet.*'}</ReactMarkdown>
      </div>
    </div>
  );
}
