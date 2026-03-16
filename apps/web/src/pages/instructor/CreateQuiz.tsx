import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import type { Module, QuizQuestion, QuestionType } from '@culinary/shared';

const emptyQuestion = (): QuizQuestion => ({
  type: 'multiple_choice',
  text: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  explanation: '',
});

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [form, setForm] = useState({ moduleId: '', title: '', description: '', passingScore: 70 });
  const [questions, setQuestions] = useState<QuizQuestion[]>([emptyQuestion()]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { client.get('/modules').then(res => setModules(res.data.data)); }, []);

  const updateQuestion = (qi: number, field: string, value: unknown) => {
    setQuestions(qs => qs.map((q, i) => i === qi ? { ...q, [field]: value } : q));
  };

  const updateOption = (qi: number, oi: number, value: string) => {
    setQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      const opts = [...q.options];
      opts[oi] = value;
      return { ...q, options: opts };
    }));
  };

  const setQuestionType = (qi: number, type: QuestionType) => {
    setQuestions(qs => qs.map((q, i) => {
      if (i !== qi) return q;
      return { ...q, type, options: type === 'true_false' ? ['True', 'False'] : ['', '', '', ''], correctIndex: 0 };
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post('/quizzes', { ...form, questions });
      navigate(`/modules/${form.moduleId}`);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-culinary-brown">🧠 Create New Quiz</h1>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-semibold text-gray-700">Quiz Details</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Module *</label>
            <select value={form.moduleId} onChange={e => setForm(f => ({ ...f, moduleId: e.target.value }))} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400">
              <option value="">Select a module...</option>
              {modules.map(m => <option key={m._id} value={m._id}>{m.code}: {m.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Quiz Title *</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input type="text" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Passing Score (%)</label>
            <input type="number" min={0} max={100} value={form.passingScore} onChange={e => setForm(f => ({ ...f, passingScore: parseInt(e.target.value) }))}
              className="w-32 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
        </div>

        {questions.map((q, qi) => (
          <div key={qi} className="card space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Question {qi + 1}</h3>
              {questions.length > 1 && (
                <button type="button" onClick={() => setQuestions(qs => qs.filter((_, i) => i !== qi))}
                  className="text-red-500 text-sm hover:underline">Remove</button>
              )}
            </div>
            <div className="flex gap-3">
              <select value={q.type} onChange={e => setQuestionType(qi, e.target.value as QuestionType)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
                <option value="multiple_choice">Multiple Choice</option>
                <option value="true_false">True/False</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-500">Question Text *</label>
              <input type="text" value={q.text} onChange={e => updateQuestion(qi, 'text', e.target.value)} required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-500">Options (check correct answer)</label>
              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <input type="radio" name={`correct_${qi}`} checked={q.correctIndex === oi}
                      onChange={() => updateQuestion(qi, 'correctIndex', oi)} className="accent-primary-500" />
                    <input type="text" value={opt} onChange={e => updateOption(qi, oi, e.target.value)}
                      disabled={q.type === 'true_false'}
                      placeholder={`Option ${oi + 1}`}
                      className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary-400 disabled:bg-gray-50" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1 text-gray-500">Explanation (optional)</label>
              <input type="text" value={q.explanation || ''} onChange={e => updateQuestion(qi, 'explanation', e.target.value)}
                placeholder="Explain why the answer is correct..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary-400" />
            </div>
          </div>
        ))}

        <button type="button" onClick={() => setQuestions(qs => [...qs, emptyQuestion()])}
          className="btn-secondary w-full">+ Add Question</button>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Creating...' : 'Create Quiz'}</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
        </div>
      </form>
    </div>
  );
}
