
import { useParams, Link } from 'react-router-dom';
import RecipeConversionGame from './games/RecipeConversionGame';
import HazardHuntGame from './games/HazardHuntGame';

export default function GameRouter() {
  const { slug } = useParams<{ slug: string }>();

  if (slug === 'recipe-conversion') return <RecipeConversionGame />;
  if (slug === 'hazard-hunt') return <HazardHuntGame />;

  return (
    <div className="text-center py-16 text-gray-400">
      <div className="text-5xl mb-2">🎮</div>
      <p className="text-xl">Game not found</p>
      <Link to="/games" className="btn-primary mt-4 inline-block">Back to Games</Link>
    </div>
  );
}
