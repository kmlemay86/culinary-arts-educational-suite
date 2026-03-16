import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import type { Recipe } from '@culinary/shared';
import { useAuth } from '../contexts/AuthContext';

export default function RecipeList() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchRecipes = (q = '') => {
    setLoading(true);
    client.get(`/recipes${q ? `?search=${encodeURIComponent(q)}` : ''}`)
      .then(res => { setRecipes(res.data.data); setLoading(false); });
  };

  useEffect(() => { fetchRecipes(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); fetchRecipes(search); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-culinary-brown">🍽️ Recipe Database</h1>
          <p className="text-gray-500 mt-1">Browse and search culinary recipes</p>
        </div>
        {(user?.role === 'instructor' || user?.role === 'admin') && (
          <Link to="/instructor/recipes/new" className="btn-primary">+ Add Recipe</Link>
        )}
      </div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search recipes..." 
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400" />
        <button type="submit" className="btn-primary">Search</button>
      </form>
      {loading ? <div className="flex justify-center p-16"><div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full"/></div> : (
        recipes.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-5xl mb-3">🥘</div>
            <p className="text-lg">No recipes found. {(user?.role === 'instructor' || user?.role === 'admin') ? 'Add the first one!' : ''}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recipes.map(recipe => (
              <Link key={recipe._id} to={`/recipes/${recipe._id}`}
                className="card hover:shadow-md transition-shadow group">
                {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-40 object-cover rounded-lg mb-3 -mt-2 -mx-0" />}
                <h3 className="font-bold text-lg group-hover:text-primary-600 transition-colors">{recipe.title}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2">{recipe.description}</p>
                <div className="flex gap-3 mt-3 text-xs text-gray-400">
                  <span>⏱️ {recipe.prepTimeMinutes + recipe.cookTimeMinutes} min</span>
                  <span>🍽️ {recipe.servings} servings</span>
                </div>
                {recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {recipe.tags.slice(0, 3).map(t => (
                      <span key={t} className="badge-chip bg-primary-100 text-primary-700">{t}</span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}
