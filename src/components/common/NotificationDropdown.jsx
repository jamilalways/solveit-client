import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNotifStore } from '../../store/notifStore'
import { getNotifications, markNotificationsRead } from '../../api/notifications.api'

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const notifications = useNotifStore((state) => state.notifications)
  const unread = useNotifStore((state) => state.unread)
  const setNotifications = useNotifStore((state) => state.setNotifications)
  const markAllRead = useNotifStore((state) => state.markAllRead)
  
  const ref = useRef(null)

  useEffect(() => {
    // Initial fetch of notifications
    const fetchNotifs = async () => {
      try {
        const res = await getNotifications()
        // If the store supports setting initial state, we'd use it here.
        // Assuming we need to add a setNotifications method to the store.
        if (setNotifications) {
          setNotifications(res.data.notifications, res.data.unread)
        }
      } catch (err) {
        console.error('Failed to fetch notifications:', err)
      }
    }
    fetchNotifs()
  }, [setNotifications])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = async () => {
    setOpen(!open)
    if (!open && unread > 0) {
      // Mark as read when opened
      try {
        await markNotificationsRead()
        markAllRead()
      } catch (err) {
        console.error('Failed to mark notifications read:', err)
      }
    }
  }

  return (
    <div style={{ position: 'relative' }} ref={ref}>
      <button 
        onClick={handleToggle}
        style={{
          width: 38, height: 38, borderRadius: 10, border: '1.5px solid var(--border-secondary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--bg-secondary)', cursor: 'pointer', position: 'relative',
        }}
      >
        <svg width="18" height="18" fill="none" stroke="var(--text-secondary)" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M15 17H20L18.6 15.6A1 1 0 0118 14.8V11a6 6 0 00-12 0v3.8a1 1 0 01-.3.7L4 17h5m6 0v1a3 3 0 01-6 0v-1m6 0H9"/>
        </svg>
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -6, right: -6,
            background: '#ef4444', color: '#fff', borderRadius: '50%',
            fontSize: 10, fontWeight: 'bold', padding: '2px 6px',
            border: '2px solid var(--bg-secondary)', minWidth: 20, textAlign: 'center'
          }}>
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 48, right: 0, width: 320,
          background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)',
          borderRadius: 12, boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
          zIndex: 100, overflow: 'hidden', display: 'flex', flexDirection: 'column'
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>Notifications</span>
            {unread > 0 && <span style={{ fontSize: 12, color: 'var(--text-brand)', cursor: 'pointer', fontWeight: 600 }} onClick={handleToggle}>Mark all read</span>}
          </div>
          
          <div style={{ maxHeight: 360, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <Link 
                  key={n.id || n._id} 
                  to={n.link || '#'} 
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'block', padding: '12px 16px', borderBottom: '1px solid var(--border-light)',
                    textDecoration: 'none', background: n.read ? 'transparent' : 'var(--bg-accent)',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {n.message}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
