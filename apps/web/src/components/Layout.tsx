
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-culinary-brown text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold">
              <span className="text-2xl">🍳</span>
              <span>Culinary Arts Suite</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link to="/modules" className="hover:text-primary-300 transition-colors">Modules</Link>
              <Link to="/recipes" className="hover:text-primary-300 transition-colors">Recipes</Link>
              <Link to="/games" className="hover:text-primary-300 transition-colors">Games</Link>
              {user && <Link to="/progress" className="hover:text-primary-300 transition-colors">Progress</Link>}
              {(user?.role === 'instructor' || user?.role === 'admin') && (
                <Link to="/instructor" className="hover:text-primary-300 transition-colors">Instructor</Link>
              )}
              {user?.role === 'admin' && (
                <Link to="/admin" className="hover:text-primary-300 transition-colors">Admin</Link>
              )}
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-primary-200">{user.name}</span>
                  <button onClick={handleLogout} className="btn-primary text-sm py-1">Logout</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link to="/login" className="btn-secondary text-sm py-1">Login</Link>
                  <Link to="/register" className="btn-primary text-sm py-1">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="bg-culinary-brown text-white py-6 text-center text-sm">
        <p>🍴 Culinary Arts Educational Suite &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
