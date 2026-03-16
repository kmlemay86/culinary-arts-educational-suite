import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import type { Module } from '@culinary/shared';

export default function CreateLesson() {
  const navigate = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [form, setForm] = useState({ moduleId: '', title: '', content: '', videoUrl: '', imageUrl: '', order: 0 });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { client.get('/modules').then(res => setModules(res.data.data)); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post('/lessons', form);
      navigate(`/modules/${form.moduleId}`);
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to create lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-culinary-brown">📝 Create New Lesson</h1>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Module *</label>
          <select value={form.moduleId} onChange={e => setForm(f => ({ ...f, moduleId: e.target.value }))} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400">
            <option value="">Select a module...</option>
            {modules.map(m => <option key={m._id} value={m._id}>{m.code}: {m.title}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Lesson Title *</label>
          <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Content (Markdown supported)</label>
          <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={10}
            placeholder="Write lesson content here. Markdown is supported for formatting."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"/>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Video URL (optional)</label>
          <input type="url" value={form.videoUrl} onChange={e => setForm(f => ({ ...f, videoUrl: e.target.value }))}
            placeholder="https://youtube.com/..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Image URL (optional)</label>
          <input type="url" value={form.imageUrl} onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
            placeholder="https://..."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Creating...' : 'Create Lesson'}</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
        </div>
      </form>
    </div>
  );
}
