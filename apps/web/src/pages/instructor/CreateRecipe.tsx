import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import type { RecipeIngredient } from '@culinary/shared';

const emptyIngredient = (): RecipeIngredient => ({ name: '', quantity: '', unit: '' });

export default function CreateRecipe() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', servings: 4, prepTimeMinutes: 0, cookTimeMinutes: 0,
    imageUrl: '', tags: '', allergens: '',
  });
  const [ingredients, setIngredients] = useState<RecipeIngredient[]>([emptyIngredient()]);
  const [steps, setSteps] = useState<string[]>(['']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await client.post('/recipes', {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        allergens: form.allergens.split(',').map(a => a.trim()).filter(Boolean),
        ingredients,
        steps: steps.filter(s => s.trim()),
      });
      navigate('/recipes');
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } })?.response?.data?.error || 'Failed to create recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-culinary-brown">🍽️ Add New Recipe</h1>
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="card space-y-4">
          <h2 className="font-semibold">Recipe Details</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Title *</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"/>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Servings</label>
              <input type="number" min={1} value={form.servings} onChange={e => setForm(f => ({ ...f, servings: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Prep (min)</label>
              <input type="number" min={0} value={form.prepTimeMinutes} onChange={e => setForm(f => ({ ...f, prepTimeMinutes: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Cook (min)</label>
              <input type="number" min={0} value={form.cookTimeMinutes} onChange={e => setForm(f => ({ ...f, cookTimeMinutes: parseInt(e.target.value) }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
            <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
              placeholder="breakfast, vegetarian, gluten-free"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Allergens (comma-separated)</label>
            <input type="text" value={form.allergens} onChange={e => setForm(f => ({ ...f, allergens: e.target.value }))}
              placeholder="gluten, dairy, eggs"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400" />
          </div>
        </div>

        <div className="card space-y-3">
          <h2 className="font-semibold">Ingredients</h2>
          {ingredients.map((ing, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={ing.quantity} onChange={e => setIngredients(ings => ings.map((it, j) => j === i ? { ...it, quantity: e.target.value } : it))}
                placeholder="Amount" className="w-20 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-400" />
              <input type="text" value={ing.unit} onChange={e => setIngredients(ings => ings.map((it, j) => j === i ? { ...it, unit: e.target.value } : it))}
                placeholder="Unit" className="w-24 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-400" />
              <input type="text" value={ing.name} onChange={e => setIngredients(ings => ings.map((it, j) => j === i ? { ...it, name: e.target.value } : it))}
                placeholder="Ingredient name" className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-400" />
              {ingredients.length > 1 && (
                <button type="button" onClick={() => setIngredients(ings => ings.filter((_, j) => j !== i))} className="text-red-400 text-sm px-1">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setIngredients(ings => [...ings, emptyIngredient()])} className="text-primary-600 text-sm hover:underline">+ Add ingredient</button>
        </div>

        <div className="card space-y-3">
          <h2 className="font-semibold">Steps</h2>
          {steps.map((step, i) => (
            <div key={i} className="flex gap-2">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-2">{i + 1}</span>
              <textarea value={step} onChange={e => setSteps(ss => ss.map((s, j) => j === i ? e.target.value : s))}
                placeholder={`Step ${i + 1}...`} rows={2}
                className="flex-1 border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary-400" />
              {steps.length > 1 && (
                <button type="button" onClick={() => setSteps(ss => ss.filter((_, j) => j !== i))} className="text-red-400 text-sm px-1 self-start mt-2">✕</button>
              )}
            </div>
          ))}
          <button type="button" onClick={() => setSteps(ss => [...ss, ''])} className="text-primary-600 text-sm hover:underline">+ Add step</button>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="btn-primary flex-1">{loading ? 'Saving...' : 'Save Recipe'}</button>
          <button type="button" onClick={() => navigate(-1)} className="btn-secondary flex-1">Cancel</button>
        </div>
      </form>
    </div>
  );
}
