import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import type { Recipe } from '@culinary/shared';

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (!id) return;
    client.get(`/recipes/${id}`).then(res => setRecipe(res.data.data));
  }, [id]);

  if (!recipe) return <div className="flex justify-center p-16"><div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full"/></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link to="/recipes" className="text-primary-600 text-sm hover:underline">← Back to Recipes</Link>
      <h1 className="text-3xl font-bold text-culinary-brown">{recipe.title}</h1>
      {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} className="w-full rounded-xl max-h-72 object-cover" />}
      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
        <span>⏱️ Prep: {recipe.prepTimeMinutes} min</span>
        <span>🔥 Cook: {recipe.cookTimeMinutes} min</span>
        <span>🍽️ Serves: {recipe.servings}</span>
      </div>
      {recipe.description && <p className="text-gray-700">{recipe.description}</p>}
      {recipe.allergens.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <strong className="text-yellow-800">⚠️ Allergens: </strong>
          <span className="text-yellow-700">{recipe.allergens.join(', ')}</span>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold mb-3">🧂 Ingredients</h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((ing, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 bg-primary-400 rounded-full flex-shrink-0"/>
                <span>{ing.quantity} {ing.unit} {ing.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-3">📋 Instructions</h2>
          <ol className="space-y-3">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map(t => <span key={t} className="badge-chip bg-primary-100 text-primary-700">{t}</span>)}
        </div>
      )}
    </div>
  );
}
