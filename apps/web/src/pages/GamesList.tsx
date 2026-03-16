import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import type { Game } from '@culinary/shared';

export default function GamesList() {
  const [games, setGames] = useState<Game[]>([]);

  useEffect(() => {
    client.get('/games').then(res => setGames(res.data.data));
  }, []);

  const gameIcons: Record<string, string> = {
    'recipe-conversion': '🧮',
    'hazard-hunt': '🛡️',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-culinary-brown">🎮 Culinary Games</h1>
        <p className="text-gray-500 mt-1">Learn through play! These games reinforce key culinary concepts.</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {games.map(game => (
          <div key={game._id} className="card hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-3">{gameIcons[game.slug] || '🎮'}</div>
            <h2 className="text-xl font-bold">{game.title}</h2>
            <p className="text-gray-600 mt-2">{game.description}</p>
            {game.moduleCode && (
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full mt-2 inline-block">
                Module {game.moduleCode}
              </span>
            )}
            <div className="mt-4">
              <Link to={`/games/${game.slug}`} className="btn-primary w-full text-center block">
                Play Now →
              </Link>
            </div>
          </div>
        ))}
        {games.length === 0 && (
          <div className="col-span-2 text-center py-16 text-gray-400">
            <div className="text-5xl mb-2">🎮</div>
            <p>Games loading...</p>
          </div>
        )}
      </div>
    </div>
  );
}
