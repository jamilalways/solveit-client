import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const clientLinks = [
  { to: '/dashboard/client',   icon: '📊', label: 'Overview'     },
  { to: '/problems',           icon: '🔍', label: 'Browse'        },
  { to: '/post-problem',       icon: '✏️',  label: 'Post Problem'  },
  { to: '/dashboard/client/jobs', icon: '💼', label: 'My Jobs'    },
]

const solverLinks = [
  { to: '/dashboard/solver',      icon: '📊', label: 'Overview'   },
  { to: '/problems',              icon: '🔍', label: 'Browse'      },
  { to: '/dashboard/solver/bids', icon: '📨', label: 'My Bids'    },
  { to: '/dashboard/solver/earnings', icon: '💰', label: 'Earnings' },
]

const adminLinks = [
  { to: '/admin',           icon: '📊', label: 'Dashboard' },
  { to: '/admin/users',     icon: '👥', label: 'Users'     },
  { to: '/admin/disputes',  icon: '⚖️',  label: 'Disputes' },
]

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  const links =
    user?.role === 'client' ? clientLinks :
    user?.role === 'solver' ? solverLinks : adminLinks

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8f9fc' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: '#fff', borderRight: '1px solid #f0f0f5',
        display: 'flex', flexDirection: 'column', padding: '24px 16px',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <Link to="/" style={{ fontSize: 20, fontWeight: 800, color: '#4338ca', textDecoration: 'none', marginBottom: 32, paddingLeft: 8 }}>
          Solve<span style={{ color: '#f97316' }}>It</span>
        </Link>

        {/* User info */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '10px 8px', background: '#f8f9fc', borderRadius: 12, marginBottom: 20 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, background: '#eef2ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#4f46e5', flexShrink: 0,
          }}>
            {user?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{user?.name?.split(' ')[0]}</div>
            <div style={{ fontSize: 11, color: '#888', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
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
                color: active ? '#4f46e5' : '#555',
                background: active ? '#eef2ff' : 'transparent',
                transition: 'all .15s',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#f5f5ff' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 16 }}>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>

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