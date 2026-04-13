import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const clientLinks = [
  { to: '/dashboard/client',   icon: '📊', label: 'Overview'     },
  { to: '/problems',           icon: '🔍', label: 'Browse'        },
  { to: '/post-problem',       icon: '✏️',  label: 'Post Problem'  },
  { to: '/messages',           icon: '💬', label: 'Messages'      },
  { to: '/profile/edit',       icon: '👤', label: 'Edit Profile'  },
]

const solverLinks = [
  { to: '/dashboard/solver',      icon: '📊', label: 'Overview'   },
  { to: '/problems',              icon: '🔍', label: 'Browse'      },
  { to: '/messages',              icon: '💬', label: 'Messages'    },
  { to: '/profile/edit',          icon: '👤', label: 'Edit Profile'},
]

const adminLinks = [
  { to: '/admin',           icon: '📊', label: 'Dashboard' },
  { to: '/admin/users',     icon: '👥', label: 'Users'     },
  { to: '/admin/disputes',  icon: '⚖️',  label: 'Disputes' },
]

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const links =
    user?.role === 'client' ? clientLinks :
    user?.role === 'solver' ? solverLinks : adminLinks

  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'
  const avatarUrl = user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${apiBase}${user.avatar}`) : null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--bg-primary)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-primary)',
        display: 'flex', flexDirection: 'column', padding: '24px 16px',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <Link to="/" style={{ fontSize: 20, fontWeight: 800, color: '#4338ca', textDecoration: 'none', marginBottom: 32, paddingLeft: 8 }}>
          Solve<span style={{ color: '#f97316' }}>It</span>
        </Link>

        {/* User info */}
        <div style={{ padding: '16px 14px', background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 12, marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} />
            ) : (
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: 'var(--bg-accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 800, color: 'var(--text-brand)', flexShrink: 0,
              }}>
                {user?.name?.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2 }}>{user?.name?.split(' ')[0]}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: 2 }}>{user?.role}</div>
            </div>
          </div>
          
          {user?.bio && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {user.bio}
            </div>
          )}
          
          {user?.skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {user.skills.slice(0, 4).map(s => (
                <span key={s} style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-brand)', background: 'var(--bg-accent)', padding: '2px 6px', borderRadius: 6 }}>
                  {s}
                </span>
              ))}
              {user.skills.length > 4 && (
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', background: 'var(--bg-tertiary)', padding: '2px 6px', borderRadius: 6 }}>
                  +{user.skills.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1 }}>
          {links.map((link) => {
            const active = location.pathname === link.to
            return (
              <Link key={link.to} to={link.to} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '9px 12px', borderRadius: 10, marginBottom: 2,
                textDecoration: 'none', fontSize: 13, fontWeight: 600,
                color: active ? 'var(--text-brand)' : 'var(--text-secondary)',
                background: active ? 'var(--bg-accent)' : 'transparent',
                transition: 'all .15s',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-hover)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 16 }}>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Dark mode toggle */}
        <button onClick={toggleTheme} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 12px', borderRadius: 10, width: '100%',
          background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)',
          cursor: 'pointer', fontSize: 13, fontWeight: 600,
          color: 'var(--text-secondary)', fontFamily: 'inherit',
          marginBottom: 8, transition: 'all .15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
        >
          <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Logout */}
        <button onClick={logout} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '9px 12px', borderRadius: 10, width: '100%',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: '#dc2626', fontFamily: 'inherit',
        }}>
          <span>🚪</span> Log out
        </button>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: 28, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}