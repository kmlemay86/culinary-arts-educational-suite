
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-16 bg-gradient-to-br from-culinary-brown to-primary-700 rounded-2xl text-white">
        <div className="text-6xl mb-4">🍳</div>
        <h1 className="text-4xl font-bold mb-4">Culinary Arts Educational Suite</h1>
        <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
          Master culinary arts through interactive lessons, quizzes, games, and hands-on simulations.
        </p>
        {!user ? (
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-culinary-brown font-bold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors">
              Get Started Free
            </Link>
            <Link to="/modules" className="border-2 border-white text-white font-bold px-8 py-3 rounded-lg hover:bg-white/10 transition-colors">
              Browse Curriculum
            </Link>
          </div>
        ) : (
          <Link to="/modules" className="bg-white text-culinary-brown font-bold px-8 py-3 rounded-lg hover:bg-primary-50 transition-colors">
            Continue Learning
          </Link>
        )}
      </section>

      {/* Features */}
      <section>
        <h2 className="text-2xl font-bold text-center mb-8 text-culinary-brown">What You Will Learn</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📚', title: '27 Learning Modules', desc: 'Complete curriculum covering safety, techniques, nutrition, and professional skills' },
            { icon: '🧠', title: 'Interactive Quizzes', desc: 'Test your knowledge with auto-graded quizzes and instant feedback' },
            { icon: '🎮', title: 'Cooking Games', desc: 'Learn through play with recipe conversion challenges and safety simulations' },
            { icon: '📖', title: 'Recipe Database', desc: 'Browse and learn from a growing collection of professional recipes' },
            { icon: '📊', title: 'Progress Tracking', desc: 'Monitor your learning journey and see your achievements' },
            { icon: '🏆', title: 'Badges & Certificates', desc: 'Earn recognition for your accomplishments throughout the course' },
          ].map((f) => (
            <div key={f.title} className="card text-center hover:shadow-md transition-shadow">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
