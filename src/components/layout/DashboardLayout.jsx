import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import getImageUrl from '../../utils/getImageUrl'
import useBreakpoint from '../../hooks/useBreakpoint'

const clientLinks = [
  { to: '/dashboard/client',   icon: 'fi fi-rr-apps',        label: 'Overview'     },
  { to: '/problems',           icon: 'fi fi-rr-search',      label: 'Browse'       },
  { to: '/post-problem',       icon: 'fi fi-rr-edit',        label: 'Post Problem' },
  { to: '/messages',           icon: 'fi fi-rr-comment',     label: 'Messages'     },
  { to: '/profile/edit',       icon: 'fi fi-rr-user',        label: 'Edit Profile' },
]

const solverLinks = [
  { to: '/dashboard/solver',      icon: 'fi fi-rr-apps',        label: 'Overview'   },
  { to: '/problems',              icon: 'fi fi-rr-search',      label: 'Browse'      },
  { to: '/messages',              icon: 'fi fi-rr-comment',     label: 'Messages'    },
  { to: '/profile/edit',          icon: 'fi fi-rr-user',        label: 'Edit Profile'},
]

const adminLinks = [
  { to: '/admin',           icon: 'fi fi-rr-apps',            label: 'Dashboard' },
  { to: '/admin/users',     icon: 'fi fi-rr-users',           label: 'Users'     },
  { to: '/admin/disputes',  icon: 'fi fi-rr-scale-balanced',  label: 'Disputes'  },
  { to: '/admin/support',   icon: 'fi fi-rr-headset',         label: 'Support'   },
  { to: '/profile/edit',    icon: 'fi fi-rr-user',             label: 'Edit Profile' },
]

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { isSmall } = useBreakpoint()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const links =
    user?.role === 'client' ? clientLinks :
    user?.role === 'solver' ? solverLinks : adminLinks

  const avatarUrl = getImageUrl(user?.avatar)

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: isSmall ? 'column' : 'row',
      minHeight: '100vh', 
      fontFamily: "'Plus Jakarta Sans', sans-serif", 
      background: 'var(--bg-primary)' 
    }}>
      
      {/* Mobile Header */}
      {isSmall && (
        <header style={{
          height: 60, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px',
          position: 'sticky', top: 0, zIndex: 90,
        }}>
          <Link to="/" style={{ fontSize: 18, fontWeight: 800, color: '#4338ca', textDecoration: 'none' }}>
            Solve<span style={{ color: '#f97316' }}>It</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(true)}
            style={{ background: 'var(--bg-accent)', border: 'none', padding: '8px 12px', borderRadius: 8, color: 'var(--text-brand)', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
          >
            Menu ☰
          </button>
        </header>
      )}

      {/* Sidebar Overlay for Mobile */}
      {isSmall && sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100 }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        width: isSmall ? 260 : 220, 
        background: 'var(--bg-secondary)', 
        borderRight: isSmall ? 'none' : '1px solid var(--border-primary)',
        display: 'flex', 
        flexDirection: 'column', 
        padding: '24px 16px',
        position: isSmall ? 'fixed' : 'sticky', 
        top: 0, 
        left: isSmall ? (sidebarOpen ? 0 : -260) : 0,
        height: '100vh',
        zIndex: 110,
        transition: 'left 0.3s ease',
        boxShadow: isSmall && sidebarOpen ? '10px 0 30px rgba(0,0,0,0.1)' : 'none',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ fontSize: 20, fontWeight: 800, color: '#4338ca', textDecoration: 'none', paddingLeft: 8 }}>
            Solve<span style={{ color: '#f97316' }}>It</span>
          </Link>
          {isSmall && (
            <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>✕</button>
          )}
        </div>

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
          
          {!isSmall && user?.bio && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {user.bio}
            </div>
          )}
          
          {user?.skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {user.skills.slice(0, isSmall ? 2 : 4).map(s => (
                <span key={s} style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-brand)', background: 'var(--bg-accent)', padding: '2px 6px', borderRadius: 6 }}>
                  {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1 }}>
          {links.map((link) => {
            const active = link.to === '/messages' 
              ? location.pathname.startsWith('/messages')
              : location.pathname === link.to
            return (
              <Link 
                key={link.to} 
                to={link.to} 
                className="sidebar-link"
                onClick={() => isSmall && setSidebarOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 12px', borderRadius: 10, marginBottom: 2,
                  textDecoration: 'none', fontSize: 13, fontWeight: 600,
                  color: active ? 'var(--text-brand)' : 'var(--text-secondary)',
                  background: active ? 'var(--bg-accent)' : 'transparent',
                  transition: 'all .15s',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--bg-hover)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <i className={`${link.icon} sidebar-icon`} style={{ fontSize: 16 }}></i>
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Dark mode toggle */}
        <button onClick={toggleTheme} className="sidebar-link" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 12px', borderRadius: 10, width: '100%',
          background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)',
          cursor: 'pointer', fontSize: 13, fontWeight: 600,
          color: 'var(--text-secondary)', fontFamily: 'inherit',
          marginBottom: 8, transition: 'all .15s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
        >
          <i className={`${theme === 'dark' ? 'fi fi-rr-sun' : 'fi fi-rr-moon'} sidebar-icon`} style={{ fontSize: 16 }}></i>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>

        {/* Logout */}
        <button onClick={logout} className="sidebar-link" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '11px 12px', borderRadius: 10, width: '100%',
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, color: '#dc2626', fontFamily: 'inherit',
        }}>
          <i className="fi fi-rr-exit sidebar-icon" style={{ fontSize: 16 }}></i> Log out
        </button>
      </aside>

      {/* Main content */}
      <main style={{ 
        flex: 1, 
        padding: isSmall ? '20px 16px' : 28, 
        overflowY: 'auto',
        maxWidth: '100vw'
      }}>
        {children}
      </main>
    </div>
  )
}