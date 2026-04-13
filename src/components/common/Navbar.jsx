import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useNotifStore } from '../../store/notifStore'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const unread = useNotifStore((s) => s.unread)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { logout(); navigate('/') }

  const dashPath =
    user?.role === 'client' ? '/dashboard/client' :
    user?.role === 'solver' ? '/dashboard/solver' : '/admin'

  const isActive = (path) => location.pathname === path

  const linkStyle = (path) => ({
    fontSize: 14, fontWeight: 500, padding: '6px 14px', borderRadius: 10,
    textDecoration: 'none', transition: 'all .15s',
    color: isActive(path) ? 'var(--text-brand)' : 'var(--text-secondary)',
    background: isActive(path) ? 'var(--bg-accent)' : 'transparent',
  })

  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'
  const avatarUrl = user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${apiBase}${user.avatar}`) : null

  return (
    <nav style={{
      background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)',
      padding: '0 32px', height: 64, display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 50,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <Link to="/" style={{ fontSize: 20, fontWeight: 800, color: '#4338ca', textDecoration: 'none' }}>
        Solve<span style={{ color: '#f97316' }}>It</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Link to="/problems" style={linkStyle('/problems')}>Browse Problems</Link>
        {user?.role === 'client' && (
          <Link to="/post-problem" style={linkStyle('/post-problem')}>Post a Problem</Link>
        )}
        {user && (
          <Link to={dashPath} style={linkStyle(dashPath)}>Dashboard</Link>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Dark mode toggle */}
        <button onClick={toggleTheme} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            width: 38, height: 38, borderRadius: 10, border: '1.5px solid var(--border-secondary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-secondary)', cursor: 'pointer', fontSize: 16,
            transition: 'all .15s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>

        {user ? (
          <>
            {/* Messages */}
            <Link to="/messages" style={{
              width: 38, height: 38, borderRadius: 10, border: '1.5px solid var(--border-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', background: 'var(--bg-secondary)', fontSize: 16,
            }}>
              💬
            </Link>

            {/* Bell */}
            <Link to="/notifications" style={{
              width: 38, height: 38, borderRadius: 10, border: '1.5px solid var(--border-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              textDecoration: 'none', position: 'relative', background: 'var(--bg-secondary)',
            }}>
              <svg width="18" height="18" fill="none" stroke="var(--text-secondary)" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M15 17H20L18.6 15.6A1 1 0 0118 14.8V11a6 6 0 00-12 0v3.8a1 1 0 01-.3.7L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"/>
              </svg>
              {unread > 0 && (
                <span style={{
                  position: 'absolute', top: 6, right: 6, width: 8, height: 8,
                  background: '#f97316', borderRadius: '50%', border: '2px solid var(--bg-secondary)',
                }} />
              )}
            </Link>

            {/* Avatar */}
            <Link to="/profile/edit" style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
              borderRadius: 10, border: '1.5px solid var(--border-secondary)', cursor: 'pointer',
              background: 'var(--bg-secondary)', textDecoration: 'none',
            }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="" style={{ width: 28, height: 28, borderRadius: 8, objectFit: 'cover' }} />
              ) : (
                <div style={{
                  width: 28, height: 28, borderRadius: 8, background: 'var(--bg-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, color: 'var(--text-brand)',
                }}>
                  {user.name?.slice(0, 2).toUpperCase()}
                </div>
              )}
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                {user.name?.split(' ')[0]}
              </span>
            </Link>

            <button onClick={handleLogout} style={{
              border: '1.5px solid var(--border-secondary)', background: 'var(--bg-secondary)',
              color: 'var(--text-secondary)', padding: '7px 16px', borderRadius: 10, fontSize: 13,
              fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              border: '1.5px solid var(--border-secondary)', background: 'var(--bg-secondary)',
              color: 'var(--text-primary)', padding: '8px 20px', borderRadius: 10, fontSize: 13,
              fontWeight: 600, textDecoration: 'none',
            }}>Log in</Link>
            <Link to="/register" style={{
              background: '#4f46e5', color: '#fff', padding: '8px 20px',
              borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none',
            }}>Get started</Link>
          </>
        )}
      </div>
    </nav>
  )
}