import React, { useState, useEffect, useCallback } from 'react';
import client from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

interface Problem {
  ingredient: string;
  originalQty: number;
  originalUnit: string;
  scaleFactor: number;
  correctAnswer: number;
  hint: string;
}

const UNITS = ['cups', 'tablespoons', 'teaspoons', 'oz', 'lbs', 'grams', 'ml'];
const INGREDIENTS = [
  'flour', 'sugar', 'butter', 'milk', 'eggs (count)', 'salt', 'baking powder',
  'olive oil', 'chicken broth', 'heavy cream', 'cornstarch', 'vanilla extract',
];
const SCALE_FACTORS = [0.5, 0.25, 2, 3, 4, 1.5];

function generateProblem(): Problem {
  const ingredient = INGREDIENTS[Math.floor(Math.random() * INGREDIENTS.length)];
  const unit = UNITS[Math.floor(Math.random() * UNITS.length)];
  const originalQty = parseFloat((Math.random() * 3 + 0.25).toFixed(2));
  const scaleFactor = SCALE_FACTORS[Math.floor(Math.random() * SCALE_FACTORS.length)];
  const correctAnswer = parseFloat((originalQty * scaleFactor).toFixed(2));
  return {
    ingredient,
    originalQty,
    originalUnit: unit,
    scaleFactor,
    correctAnswer,
    hint: `Multiply ${originalQty} by ${scaleFactor}`,
  };
}

export default function RecipeConversionGame() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [savedScore, setSavedScore] = useState(false);

  const TOTAL_QUESTIONS = 8;

  useEffect(() => {
    client.get('/games/recipe-conversion').catch(() => {/* game metadata optional */});
    setProblems(Array.from({ length: TOTAL_QUESTIONS }, generateProblem));
  }, []);

  const nextQuestion = useCallback(() => {
    setAnswer('');
    setFeedback(null);
    setShowHint(false);
    setTimeLeft(20);
    setCurrentIndex(i => {
      if (i + 1 >= TOTAL_QUESTIONS) {
        setGameOver(true);
        return i;
      }
      return i + 1;
    });
  }, []);

  useEffect(() => {
    if (gameOver || feedback !== null) return;
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setFeedback('wrong');
          setTimeout(() => nextQuestion(), 1500);
          return 20;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver, feedback, nextQuestion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problems[currentIndex]) return;
    const num = parseFloat(answer);
    const correct = problems[currentIndex].correctAnswer;
    const isCorrect = Math.abs(num - correct) <= correct * 0.05;
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setFeedback('wrong');
    }
    setTimeout(() => nextQuestion(), 1500);
  };

  const saveScore = async () => {
    if (!user || savedScore) return;
    const pct = Math.round((score / TOTAL_QUESTIONS) * 100);
    await client.post('/games/recipe-conversion/attempt', { score: pct, details: { correct: score, total: TOTAL_QUESTIONS } });
    setSavedScore(true);
  };

  const restart = () => {
    setProblems(Array.from({ length: TOTAL_QUESTIONS }, generateProblem));
    setCurrentIndex(0);
    setAnswer('');
    setScore(0);
    setFeedback(null);
    setShowHint(false);
    setGameOver(false);
    setTimeLeft(20);
    setSavedScore(false);
  };

  if (problems.length === 0) return <div className="flex justify-center p-16"><div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full"/></div>;

  const problem = problems[currentIndex];

  if (gameOver) {
    const pct = Math.round((score / TOTAL_QUESTIONS) * 100);
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-8">
        <div className="text-6xl">{pct >= 70 ? '🎉' : '📚'}</div>
        <h2 className="text-3xl font-bold">{pct >= 70 ? 'Great Work!' : 'Keep Practicing!'}</h2>
        <div className="card">
          <p className="text-5xl font-black text-primary-600">{score}/{TOTAL_QUESTIONS}</p>
          <p className="text-gray-500 mt-1">({pct}%)</p>
        </div>
        {user && !savedScore && (
          <button onClick={saveScore} className="btn-primary w-full">Save Score & Earn Badge</button>
        )}
        {savedScore && <p className="text-green-600 font-medium">✅ Score saved! Check your badges!</p>}
        <button onClick={restart} className="btn-secondary w-full">Play Again</button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-culinary-brown">🧮 Recipe Conversion</h1>
          <p className="text-gray-500 text-sm">Scale the recipe ingredient to the new yield</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Question {currentIndex + 1}/{TOTAL_QUESTIONS}</p>
          <p className="font-bold text-primary-600">Score: {score}</p>
        </div>
      </div>

      {/* Timer */}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div className={`h-3 rounded-full transition-all ${timeLeft <= 5 ? 'bg-red-500' : 'bg-primary-500'}`}
          style={{ width: `${(timeLeft / 20) * 100}%` }}/>
      </div>
      <p className="text-center text-sm text-gray-500">{timeLeft}s remaining</p>

      {/* Problem */}
      <div className="card text-center space-y-4">
        <div className="bg-culinary-cream rounded-xl p-4">
          <p className="text-gray-500 text-sm mb-1">Original Recipe</p>
          <p className="text-2xl font-bold">{problem.originalQty} {problem.originalUnit}</p>
          <p className="text-gray-600">{problem.ingredient}</p>
        </div>
        <div className="text-3xl">×</div>
        <div className="bg-primary-50 rounded-xl p-4">
          <p className="text-gray-500 text-sm mb-1">Scale Factor</p>
          <p className="text-3xl font-black text-primary-600">{problem.scaleFactor}x</p>
        </div>
        <div className="text-gray-500 text-sm">How much {problem.ingredient} do you need?</div>
      </div>

      {feedback && (
        <div className={`rounded-xl p-4 text-center font-bold text-lg ${feedback === 'correct' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {feedback === 'correct' ? '✅ Correct!' : `❌ Correct answer: ${problem.correctAnswer} ${problem.originalUnit}`}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input type="number" step="0.01" value={answer} onChange={e => setAnswer(e.target.value)}
            placeholder="Enter amount..." required
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary-400" />
          <span className="flex items-center px-3 bg-gray-100 rounded-lg text-gray-600 border border-gray-300">{problem.originalUnit}</span>
        </div>
        <button type="submit" className="btn-primary w-full text-lg py-3" disabled={!!feedback}>Submit</button>
      </form>

      <button onClick={() => setShowHint(!showHint)} className="text-sm text-primary-500 hover:underline w-full text-center">
        {showHint ? 'Hide hint' : '💡 Show hint'}
      </button>
      {showHint && <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">💡 {problem.hint}</div>}
    </div>
  );
}
