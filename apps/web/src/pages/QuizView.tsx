import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import client from '../api/client';
import type { Quiz as QuizType } from '@culinary/shared';
import { useAuth } from '../contexts/AuthContext';

interface FeedbackItem { correct: boolean; correctIndex: number; explanation?: string; }

export default function QuizView() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<QuizType | null>(null);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    client.get(`/quizzes/${id}`).then(res => {
      setQuiz(res.data.data);
      setAnswers(new Array(res.data.data.questions.length).fill(null));
    });
  }, [id]);

  const handleSubmit = async () => {
    if (!quiz || answers.some(a => a === null)) {
      setError('Please answer all questions before submitting.');
      return;
    }
    if (!user) {
      setError('You must be logged in to submit a quiz.');
      return;
    }
    try {
      const res = await client.post(`/quizzes/${id}/attempt`, { answers });
      setScore(res.data.data.score);
      setPassed(res.data.data.passed);
      setFeedback(res.data.data.feedback);
      setSubmitted(true);
      setError('');
    } catch {
      setError('Failed to submit quiz. Please try again.');
    }
  };

  if (!quiz) return <div className="flex justify-center p-16"><div className="animate-spin h-10 w-10 border-4 border-primary-500 border-t-transparent rounded-full"/></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Link to={`/modules/${quiz.moduleId}`} className="text-primary-600 text-sm hover:underline">← Back to Module</Link>
        <h1 className="text-2xl font-bold text-culinary-brown mt-2">{quiz.title}</h1>
        {quiz.description && <p className="text-gray-600 mt-1">{quiz.description}</p>}
        <p className="text-sm text-gray-500 mt-1">{quiz.questions.length} questions · Passing score: {quiz.passingScore}%</p>
      </div>

      {submitted && (
        <div className={`rounded-xl p-6 text-center ${passed ? 'bg-green-50 border-2 border-green-300' : 'bg-red-50 border-2 border-red-300'}`}>
          <div className="text-5xl mb-2">{passed ? '🎉' : '📚'}</div>
          <h2 className="text-2xl font-bold">{passed ? 'You Passed!' : 'Keep Practicing!'}</h2>
          <p className="text-4xl font-black mt-2">{score}%</p>
          <p className="text-gray-600 mt-1">Passing score: {quiz.passingScore}%</p>
          {passed && <p className="text-green-700 mt-2 font-medium">🏆 You may have earned a badge!</p>}
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}

      <div className="space-y-6">
        {quiz.questions.map((q, qi) => (
          <div key={qi} className={`card ${submitted && (feedback[qi]?.correct ? 'border-l-4 border-green-400' : 'border-l-4 border-red-400')}`}>
            <p className="font-semibold mb-3">
              <span className="text-gray-400 text-sm">Q{qi + 1}. </span>{q.text}
            </p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi;
                const isCorrect = submitted && feedback[qi]?.correctIndex === oi;
                const isWrong = submitted && isSelected && !feedback[qi]?.correct;
                return (
                  <label key={oi} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    isCorrect ? 'bg-green-50 border-green-400' :
                    isWrong ? 'bg-red-50 border-red-400' :
                    isSelected ? 'bg-primary-50 border-primary-400' :
                    'border-gray-200 hover:bg-gray-50'
                  }`}>
                    <input type="radio" name={`q${qi}`} value={oi}
                      checked={isSelected}
                      onChange={() => !submitted && setAnswers(prev => { const a = [...prev]; a[qi] = oi; return a; })}
                      disabled={submitted}
                      className="accent-primary-500" />
                    <span className="text-sm">{opt}</span>
                    {isCorrect && <span className="ml-auto text-green-600 text-sm">✓ Correct</span>}
                    {isWrong && <span className="ml-auto text-red-600 text-sm">✗</span>}
                  </label>
                );
              })}
            </div>
            {submitted && feedback[qi]?.explanation && (
              <p className="mt-3 text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded">
                💡 {feedback[qi].explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {!submitted && (
        <button onClick={handleSubmit} className="btn-primary w-full text-lg py-3">
          Submit Quiz
        </button>
      )}
      {submitted && (
        <div className="flex gap-4">
          <button onClick={() => { setSubmitted(false); setAnswers(new Array(quiz.questions.length).fill(null)); }} className="btn-secondary flex-1">
            Try Again
          </button>
          <Link to={`/modules/${quiz.moduleId}`} className="btn-primary flex-1 text-center">
            Back to Module
          </Link>
        </div>
      )}
    </div>
  );
}
