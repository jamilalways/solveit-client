import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import NotificationDropdown from './NotificationDropdown'
import getImageUrl from '../../utils/getImageUrl'
import useBreakpoint from '../../hooks/useBreakpoint'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { isSmall } = useBreakpoint()
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => { 
    logout()
    setMenuOpen(false)
    navigate('/') 
  }

  const dashPath =
    user?.role === 'client' ? '/dashboard/client' :
    user?.role === 'solver' ? '/dashboard/solver' : '/admin'

  const isActive = (path) => location.pathname === path

  const linkStyle = (path) => ({
    fontSize: isSmall ? 16 : 14, 
    fontWeight: isSmall ? 700 : 500, 
    padding: isSmall ? '12px 16px' : '6px 14px', 
    borderRadius: 10,
    textDecoration: 'none', transition: 'all .15s',
    color: isActive(path) ? 'var(--text-brand)' : 'var(--text-secondary)',
    background: isActive(path) ? 'var(--bg-accent)' : 'transparent',
    display: isSmall ? 'block' : 'inline-block',
  })

  const avatarUrl = getImageUrl(user?.avatar)

  return (
    <nav style={{
      background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)',
      padding: isSmall ? '0 16px' : '0 32px', height: 64, display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      position: 'sticky', top: 0, zIndex: 100,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <Link to="/" style={{ fontSize: 20, fontWeight: 800, color: '#4338ca', textDecoration: 'none', zIndex: 110 }}>
        Solve<span style={{ color: '#f97316' }}>It</span>
      </Link>

      {/* Desktop Links */}
      {!isSmall && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Link to="/problems" style={linkStyle('/problems')}>Browse Problems</Link>
          {user?.role === 'client' && (
            <Link to="/post-problem" style={linkStyle('/post-problem')}>Post a Problem</Link>
          )}
          {user && (
            <Link to={dashPath} style={linkStyle(dashPath)}>Dashboard</Link>
          )}
        </div>
      )}

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

        {!isSmall ? (
          <>
            {user ? (
              <>
                <Link to="/messages" style={{
                  width: 38, height: 38, borderRadius: 10, border: '1.5px solid var(--border-secondary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', background: 'var(--bg-secondary)', fontSize: 16,
                }}>
                  💬
                </Link>
                <NotificationDropdown />
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
          </>
        ) : (
          /* Mobile Menu Toggle */
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              width: 38, height: 38, borderRadius: 10, border: '1.5px solid var(--border-secondary)',
              background: 'var(--bg-secondary)', cursor: 'pointer', fontSize: 18, zIndex: 110,
            }}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isSmall && menuOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'var(--bg-secondary)', zIndex: 105,
          padding: '80px 20px 20px', display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <Link to="/problems" onClick={() => setMenuOpen(false)} style={linkStyle('/problems')}>Browse Problems</Link>
          {user?.role === 'client' && (
            <Link to="/post-problem" onClick={() => setMenuOpen(false)} style={linkStyle('/post-problem')}>Post a Problem</Link>
          )}
          {user && (
            <>
              <Link to={dashPath} onClick={() => setMenuOpen(false)} style={linkStyle(dashPath)}>Dashboard</Link>
              <Link to="/messages" onClick={() => setMenuOpen(false)} style={linkStyle('/messages')}>Messages 💬</Link>
              <Link to="/profile/edit" onClick={() => setMenuOpen(false)} style={linkStyle('/profile/edit')}>Profile 👤</Link>
              <div style={{ height: 1, background: 'var(--border-primary)', margin: '10px 0' }} />
              <button onClick={handleLogout} style={{
                textAlign: 'left', padding: '12px 16px', background: 'none', border: 'none',
                color: '#dc2626', fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
              }}>
                🚪 Log out
              </button>
            </>
          )}
          {!user && (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} style={linkStyle('/login')}>Log in</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{ ...linkStyle('/register'), background: '#4f46e5', color: '#fff', marginTop: 10 }}>Get started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}