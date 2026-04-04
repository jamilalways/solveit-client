// src/components/common/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../context/AuthContext';
import { useNotifStore } from '../../store/notifStore';

export default function Navbar() {
  const { user, logout } = useAuth();
  const unread = useNotifStore(s => s.unread);
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const dashPath = user?.role === 'client' ? '/dashboard/client'
                 : user?.role === 'solver' ? '/dashboard/solver' : '/admin';

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-700">
          Solve<span className="text-accent-500">It</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link to="/problems" className="nav-link">Browse Problems</Link>
          {user?.role === 'client' && (
            <Link to="/post-problem" className="nav-link">Post a Problem</Link>
          )}
          {user && (
            <Link to={dashPath} className="nav-link">Dashboard</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Notification Bell */}
              <Link to="/notifications" className="relative p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <BellIcon className="w-5 h-5 text-gray-600" />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-500 rounded-full border-2 border-white" />
                )}
              </Link>

              {/* Avatar dropdown */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700">
                  {user.name.slice(0,2).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-800">{user.name.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="btn-outline text-sm">Log out</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-outline">Log in</Link>
              <Link to="/register" className="btn-primary">Get started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}