import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import client from '../../api/client';

interface StudentSummary {
  user: { _id: string; name: string; email: string };
  overallCompletion: number;
  badgesEarned: number;
  quizzesTaken: number;
  gamesPlayed: number;
}

export default function InstructorDashboard() {
  const [students, setStudents] = useState<StudentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.get('/progress/students').then(res => {
      setStudents(res.data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-culinary-brown">👩‍🏫 Instructor Dashboard</h1>

      <div className="grid md:grid-cols-3 gap-4">
        <Link to="/instructor/lessons/new" className="card text-center hover:shadow-md transition-shadow group">
          <div className="text-4xl mb-2">📝</div>
          <h3 className="font-bold group-hover:text-primary-600">Create Lesson</h3>
          <p className="text-sm text-gray-500 mt-1">Add new lesson content to a module</p>
        </Link>
        <Link to="/instructor/quizzes/new" className="card text-center hover:shadow-md transition-shadow group">
          <div className="text-4xl mb-2">🧠</div>
          <h3 className="font-bold group-hover:text-primary-600">Create Quiz</h3>
          <p className="text-sm text-gray-500 mt-1">Build a quiz for any module</p>
        </Link>
        <Link to="/instructor/recipes/new" className="card text-center hover:shadow-md transition-shadow group">
          <div className="text-4xl mb-2">🍽️</div>
          <h3 className="font-bold group-hover:text-primary-600">Add Recipe</h3>
          <p className="text-sm text-gray-500 mt-1">Add a recipe to the database</p>
        </Link>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">📊 Student Progress</h2>
        {loading ? <div className="flex justify-center p-8"><div className="animate-spin h-8 w-8 border-4 border-primary-500 border-t-transparent rounded-full"/></div> :
          students.length === 0 ? (
            <div className="card text-center text-gray-400">
              <p>No students enrolled yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Student</th>
                    <th className="text-left py-3 px-4 font-semibold">Completion</th>
                    <th className="text-left py-3 px-4 font-semibold">Badges</th>
                    <th className="text-left py-3 px-4 font-semibold">Quizzes</th>
                    <th className="text-left py-3 px-4 font-semibold">Games</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s) => (
                    <tr key={s.user._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <p className="font-medium">{s.user.name}</p>
                        <p className="text-gray-400 text-xs">{s.user.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div className="bg-primary-500 h-2 rounded-full" style={{ width: `${s.overallCompletion}%` }}/>
                          </div>
                          <span>{s.overallCompletion}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">{s.badgesEarned} 🏆</td>
                      <td className="py-3 px-4">{s.quizzesTaken}</td>
                      <td className="py-3 px-4">{s.gamesPlayed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        }
      </div>
    </div>
  );
}
