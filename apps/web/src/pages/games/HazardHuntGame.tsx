import { useState } from 'react';
import client from '../../api/client';
import { useAuth } from '../../contexts/AuthContext';

interface Hazard {
  id: string;
  text: string;
  category: 'food_safety' | 'physical' | 'chemical' | 'biological';
  explanation: string;
}

interface Scenario {
  title: string;
  description: string;
  hazards: Hazard[];
  distractors: string[];
}

const SCENARIOS: Scenario[] = [
  {
    title: 'The Morning Prep Kitchen',
    description: 'It is 7 AM and the prep team just arrived. Look around the kitchen and identify all safety hazards.',
    hazards: [
      { id: 'h1', text: 'Raw chicken left on counter at room temperature for 2 hours', category: 'food_safety', explanation: 'Raw chicken left in the temperature danger zone (40°F–140°F) for more than 2 hours can grow dangerous bacteria.' },
      { id: 'h2', text: 'Wet floor near the dishwashing area with no wet floor sign', category: 'physical', explanation: 'Wet floors without warning signs are a major slip and fall hazard in professional kitchens.' },
      { id: 'h3', text: 'Cutting board used for raw meat now being used for vegetables without washing', category: 'food_safety', explanation: 'Cross-contamination can transfer dangerous pathogens from raw meat to ready-to-eat foods.' },
      { id: 'h4', text: 'Cleaning chemicals stored next to food prep area', category: 'chemical', explanation: 'Chemicals must be stored away from food and food contact surfaces to prevent chemical contamination.' },
      { id: 'h5', text: 'Cook not wearing gloves while handling ready-to-eat food', category: 'biological', explanation: 'Ready-to-eat foods must be handled with gloves or utensils to prevent contamination from hands.' },
    ],
    distractors: [
      'Chef wearing a clean apron',
      'Thermometer available near the stove',
      'Cutting boards color-coded by food type',
      'Handwashing sink with soap and paper towels',
    ],
  },
  {
    title: 'The Storage Room',
    description: 'Inspect the dry storage and refrigeration areas for food safety violations.',
    hazards: [
      { id: 'h6', text: 'Raw beef stored above ready-to-eat salad greens in the refrigerator', category: 'food_safety', explanation: 'Raw proteins must be stored below ready-to-eat foods to prevent drip contamination.' },
      { id: 'h7', text: 'Food stored directly on the floor', category: 'physical', explanation: 'Food must be stored at least 6 inches off the floor to prevent contamination and pest access.' },
      { id: 'h8', text: 'Unlabeled container with no date in the refrigerator', category: 'food_safety', explanation: 'All food items must be labeled with contents and date to ensure proper rotation and prevent serving expired food.' },
      { id: 'h9', text: 'Refrigerator temperature reading 48°F (9°C)', category: 'food_safety', explanation: 'Refrigerators must be kept at 41°F (5°C) or below to slow bacterial growth.' },
    ],
    distractors: [
      'FIFO rotation labels on canned goods',
      'Clean shelving units',
      'Properly sealed dry goods in labeled containers',
    ],
  },
  {
    title: 'During Service',
    description: 'The restaurant is busy during the dinner rush. Identify safety hazards in this high-pressure environment.',
    hazards: [
      { id: 'h10', text: 'Hot pan handle extending into the walkway', category: 'physical', explanation: 'Pan handles extending into walkways are burn hazards for both the cook and anyone passing by.' },
      { id: 'h11', text: 'Cook tasting food from serving spoon then putting it back in the pot', category: 'biological', explanation: 'Tasting with serving utensils and returning them introduces bacteria into the food. Use a separate clean tasting spoon.' },
      { id: 'h12', text: 'Towel used for wiping hands and counters stored in apron pocket', category: 'food_safety', explanation: 'Wiping cloths must be stored in sanitizing solution between uses to prevent spreading bacteria.' },
      { id: 'h13', text: 'Food being cooled in a large deep container', category: 'food_safety', explanation: 'Large volumes of food cool too slowly in deep containers. Cool in shallow pans to reduce time in the danger zone.' },
    ],
    distractors: [
      "Chef's knife stored safely in a knife holder",
      'Cook washing hands after handling raw meat',
      'Food temperatures being checked with a calibrated thermometer',
    ],
  },
];

export default function HazardHuntGame() {
  const { user } = useAuth();
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [found, setFound] = useState<Set<string>>(new Set());
  const [wrongClicks, setWrongClicks] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [savedScore, setSavedScore] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [scenarioScores, setScenarioScores] = useState<number[]>([]);

  const scenario = SCENARIOS[scenarioIndex];
  const allItems = [
    ...scenario.hazards.map(h => ({ ...h, isHazard: true })),
    ...scenario.distractors.map((t, i) => ({ id: `d${i}`, text: t, isHazard: false, category: 'none' as const, explanation: '' })),
  ];
  const shuffled = [...allItems].sort((a, b) => a.id.localeCompare(b.id));

  const handleClick = (item: { id: string; isHazard: boolean }) => {
    if (submitted) return;
    if (item.isHazard) {
      setFound(prev => new Set([...prev, item.id]));
    } else {
      setWrongClicks(w => w + 1);
    }
  };

  const handleSubmitScenario = () => {
    const hazardCount = scenario.hazards.length;
    const foundCount = found.size;
    const penalty = wrongClicks * 5;
    const scenarioScore = Math.max(0, Math.round((foundCount / hazardCount) * 100) - penalty);
    setScenarioScores(prev => [...prev, scenarioScore]);
    setSubmitted(true);
  };

  const handleNext = () => {
    if (scenarioIndex + 1 >= SCENARIOS.length) {
      const allScores = [...scenarioScores];
      const avg = Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length);
      setTotalScore(avg);
      setShowResults(true);
    } else {
      setScenarioIndex(i => i + 1);
      setFound(new Set());
      setWrongClicks(0);
      setSubmitted(false);
    }
  };

  const saveScore = async () => {
    if (!user || savedScore) return;
    await client.post('/games/hazard-hunt/attempt', { score: totalScore, details: { scenarios: scenarioScores } });
    setSavedScore(true);
  };

  const restart = () => {
    setScenarioIndex(0);
    setFound(new Set());
    setWrongClicks(0);
    setSubmitted(false);
    setTotalScore(0);
    setSavedScore(false);
    setShowResults(false);
    setScenarioScores([]);
  };

  if (showResults) {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 py-8">
        <div className="text-6xl">{totalScore >= 70 ? '🛡️' : '📚'}</div>
        <h2 className="text-3xl font-bold">{totalScore >= 70 ? 'Safety Expert!' : 'Keep Studying!'}</h2>
        <div className="card space-y-2">
          <p className="text-5xl font-black text-primary-600">{totalScore}%</p>
          <p className="text-gray-500">Average across {SCENARIOS.length} scenarios</p>
          {scenarioScores.map((s, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{SCENARIOS[i].title}</span>
              <span className="font-medium">{s}%</span>
            </div>
          ))}
        </div>
        {user && !savedScore && (
          <button onClick={saveScore} className="btn-primary w-full">Save Score & Earn Badge</button>
        )}
        {savedScore && <p className="text-green-600 font-medium">✅ Score saved!</p>}
        <button onClick={restart} className="btn-secondary w-full">Play Again</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-culinary-brown">🛡️ Kitchen Safety Hazard Hunt</h1>
          <p className="text-gray-500 text-sm">Scenario {scenarioIndex + 1} of {SCENARIOS.length}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Found: {found.size}/{scenario.hazards.length}</p>
          {wrongClicks > 0 && <p className="text-xs text-red-500">Wrong clicks: -{wrongClicks * 5} pts</p>}
        </div>
      </div>

      <div className="card bg-amber-50 border-amber-200">
        <h2 className="font-bold text-amber-800 text-lg">{scenario.title}</h2>
        <p className="text-amber-700 text-sm mt-1">{scenario.description}</p>
        <p className="text-xs text-amber-600 mt-2">👆 Click on all the safety hazards you can find!</p>
      </div>

      <div className="grid gap-3">
        {shuffled.map((item) => {
          const isFound = found.has(item.id);
          const isHazardItem = (item as { isHazard: boolean }).isHazard;
          const showCorrect = submitted && isHazardItem;
          const showMissed = submitted && isHazardItem && !isFound;
          return (
            <button key={item.id} onClick={() => handleClick(item as { id: string; isHazard: boolean })}
              disabled={isFound || submitted}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                isFound ? 'bg-red-50 border-red-400 cursor-default' :
                showMissed ? 'bg-orange-50 border-orange-300' :
                showCorrect ? 'bg-green-50 border-green-300' :
                'bg-white border-gray-200 hover:border-primary-300 hover:bg-primary-50 cursor-pointer'
              }`}>
              <div className="flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">
                  {isFound ? '🚨' : showCorrect ? '✅' : showMissed ? '⚠️' : '•'}
                </span>
                <div>
                  <p className="text-sm font-medium">{item.text}</p>
                  {(isFound || (submitted && isHazardItem)) && (item as Hazard).explanation && (
                    <p className="text-xs text-gray-600 mt-1 italic">💡 {(item as Hazard).explanation}</p>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <button onClick={handleSubmitScenario} className="btn-primary w-full py-3">
          Submit Answers ({found.size} hazards found)
        </button>
      ) : (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="font-bold text-blue-800">Scenario Complete!</p>
            <p className="text-blue-600 text-sm">Found {found.size}/{scenario.hazards.length} hazards</p>
          </div>
          <button onClick={handleNext} className="btn-primary w-full py-3">
            {scenarioIndex + 1 < SCENARIOS.length ? 'Next Scenario →' : 'See Final Results'}
          </button>
        </div>
      )}
    </div>
  );
}
