import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Spinner from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import api from '../../api/axios'
import { formatDate } from '../../utils/formatDate'
import { formatBDT } from '../../utils/formatCurrency'
import { supportApi } from '../../api/support.api'
import useBreakpoint from '../../hooks/useBreakpoint'

// ─── Demo data (used when backend not connected) ───────────────────────────
const DEMO_STATS = {
  totalUsers: 124,
  totalProblems: 87,
  totalContracts: 43,
  openDisputes: 3,
  totalRevenue: 284500,
}

const DEMO_USERS = [
  { _id: 'u1', name: 'Arif Khan',     email: 'arif@example.com',    role: 'client', isBanned: false, createdAt: new Date(Date.now() - 30 * 86400000) },
  { _id: 'u2', name: 'Samin Reza',    email: 'samin@example.com',   role: 'solver', isBanned: false, createdAt: new Date(Date.now() - 20 * 86400000) },
  { _id: 'u3', name: 'Rafiq Mia',     email: 'rafiq@example.com',   role: 'client', isBanned: true,  createdAt: new Date(Date.now() - 15 * 86400000) },
  { _id: 'u4', name: 'Tasnim Ahmed',  email: 'tasnim@example.com',  role: 'solver', isBanned: false, createdAt: new Date(Date.now() - 10 * 86400000) },
  { _id: 'u5', name: 'Karim Uddin',   email: 'karim@example.com',   role: 'client', isBanned: false, createdAt: new Date(Date.now() - 7 * 86400000)  },
  { _id: 'u6', name: 'Nadia Islam',   email: 'nadia@example.com',   role: 'solver', isBanned: false, createdAt: new Date(Date.now() - 5 * 86400000)  },
  { _id: 'u7', name: 'Hasan Ali',     email: 'hasan@example.com',   role: 'solver', isBanned: true,  createdAt: new Date(Date.now() - 3 * 86400000)  },
]

const DEMO_DISPUTES = [
  { _id: 'd1', contract: { _id: 'c1', amount: 3500 }, raisedBy: { name: 'Arif Khan', email: 'arif@example.com', role: 'client' }, reason: 'Solver delivered incomplete work. The API is missing payment endpoints that were clearly specified in the requirements.', status: 'open', createdAt: new Date(Date.now() - 86400000) },
  { _id: 'd2', contract: { _id: 'c2', amount: 2000 }, raisedBy: { name: 'Samin Reza', email: 'samin@example.com', role: 'solver' }, reason: 'Client is not responding for 7 days and has not reviewed the submitted work despite multiple messages.', status: 'open', createdAt: new Date(Date.now() - 2 * 86400000) },
  { _id: 'd3', contract: { _id: 'c3', amount: 800  }, raisedBy: { name: 'Karim Uddin', email: 'karim@example.com', role: 'client' }, reason: 'The Excel macro does not work as described. It crashes on every third sheet.', status: 'under_review', createdAt: new Date(Date.now() - 3 * 86400000) },
  { _id: 'd4', contract: { _id: 'c4', amount: 1200 }, raisedBy: { name: 'Tasnim Ahmed', email: 'tasnim@example.com', role: 'solver' }, reason: 'Client changed requirements 3 times after contract started without adjusting budget.', status: 'resolved', createdAt: new Date(Date.now() - 5 * 86400000) },
]

const DEMO_PROBLEMS = [
  { _id: 'p1', title: 'Build REST API for e-commerce',    category: 'Programming', budget: 3500, status: 'active',    client: { name: 'Arif Khan'   }, createdAt: new Date(Date.now() - 5 * 86400000) },
  { _id: 'p2', title: 'Design logo and brand kit',         category: 'Design',      budget: 2000, status: 'open',      client: { name: 'Karim Uddin' }, createdAt: new Date(Date.now() - 3 * 86400000) },
  { _id: 'p3', title: 'Excel VBA automation script',       category: 'Data & Excel',budget: 800,  status: 'completed', client: { name: 'Nadia Islam' }, createdAt: new Date(Date.now() - 10 * 86400000) },
  { _id: 'p4', title: 'Write 5 SEO articles',              category: 'Writing',     budget: 1200, status: 'open',      client: { name: 'Arif Khan'   }, createdAt: new Date(Date.now() - 1 * 86400000) },
  { _id: 'p5', title: 'Mobile UI for food delivery app',   category: 'Mobile App',  budget: 2800, status: 'active',    client: { name: 'Rafiq Mia'   }, createdAt: new Date(Date.now() - 2 * 86400000) },
]

// ─── Helpers ───────────────────────────────────────────────────────────────
const statusStyle = {
  open:         { bg: 'var(--status-open-bg)',   color: 'var(--status-open-color)' },
  active:       { bg: 'var(--status-active-bg)', color: 'var(--status-active-color)' },
  in_review:    { bg: 'var(--status-review-bg)', color: 'var(--status-review-color)' },
  completed:    { bg: 'var(--status-done-bg)',   color: 'var(--status-done-color)' },
  cancelled:    { bg: 'var(--error-bg)',         color: 'var(--error-text)' },
  under_review: { bg: 'var(--status-review-bg)', color: 'var(--status-review-color)' },
  resolved:     { bg: 'var(--status-done-bg)',   color: 'var(--status-done-color)' },
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, isMobile }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 14, padding: isMobile ? '14px 18px' : '18px 22px', display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 16 }}>
      <div style={{ width: isMobile ? 40 : 48, height: isMobile ? 40 : 48, borderRadius: 12, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? 18 : 22, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: isMobile ? 18 : 24, fontWeight: 800, color }}>{value}</div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user }  = useAuth()
  const { theme } = useTheme()
  const isDark    = theme === 'dark'
  const { isMobile, isTablet, isSmall } = useBreakpoint()
  const navigate  = useNavigate()
  const location  = useLocation()
  
  const initialTab = 
    location.pathname === '/admin/users' ? 'users' :
    location.pathname === '/admin/disputes' ? 'disputes' :
    location.pathname === '/admin/problems' ? 'problems' :
    location.pathname === '/admin/support' ? 'support' : 'overview'

  const [tab, setTab]               = useState(initialTab)
  const [stats, setStats]           = useState(DEMO_STATS)
  const [users, setUsers]           = useState(DEMO_USERS)
  const [disputes, setDisputes]     = useState(DEMO_DISPUTES)
  const [problems, setProblems]     = useState(DEMO_PROBLEMS)
  const [supportTickets, setSupportTickets] = useState([])
  const [loading, setLoading]       = useState(false)
  const [searchUser, setSearchUser] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [resolveModal, setResolveModal]   = useState(null)
  const [resolveNote, setResolveNote]     = useState('')
  const [resolution, setResolution]       = useState('solver_wins')
  const [resolveLoading, setResolveLoading] = useState(false)
  const [deleteModal, setDeleteModal]     = useState(null)
  const [actionMsg, setActionMsg]         = useState('')

  // Theme values
  const card   = 'var(--bg-card)'
  const border = 'var(--border-primary)'
  const text   = 'var(--text-primary)'
  const sub    = 'var(--text-muted)'
  const inputBg = 'var(--input-bg)'

  // Fetch all data on mount
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [statsRes, usersRes, disputesRes, problemsRes, supportRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/admin/users'),
          api.get('/admin/disputes'),
          api.get('/problems?limit=50'),
          supportApi.getAllTicketsForAdmin().catch(() => ({ tickets: [] })),
        ])
        setStats(statsRes.data.stats)
        setUsers(usersRes.data.users)
        setDisputes(disputesRes.data.disputes)
        setProblems(problemsRes.data.problems || [])
        setSupportTickets(supportRes.tickets || [])
      } catch {
        // Use demo data
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Sync tab with URL
  useEffect(() => {
    if (location.pathname === '/admin/users') setTab('users')
    else if (location.pathname === '/admin/disputes') setTab('disputes')
    else if (location.pathname === '/admin/problems') setTab('problems')
    else if (location.pathname === '/admin/support') setTab('support')
    else if (location.pathname === '/admin') setTab('overview')
  }, [location.pathname])

  const handleBan = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/ban`)
      setUsers(users.map(u => u._id === userId ? { ...u, isBanned: !u.isBanned } : u))
      setActionMsg(res.data.message || 'User status updated.')
      setTimeout(() => setActionMsg(''), 3000)
    } catch (err) {
      setUsers(users.map(u => u._id === userId ? { ...u, isBanned: !u.isBanned } : u))
      setActionMsg('User status updated (demo).')
      setTimeout(() => setActionMsg(''), 3000)
    }
  }

  const handleDeleteProblem = async (problemId) => {
    try {
      await api.delete(`/problems/${problemId}`)
      setProblems(problems.filter(p => p._id !== problemId))
      setDeleteModal(null)
      setActionMsg('Problem deleted successfully.')
      setTimeout(() => setActionMsg(''), 3000)
    } catch (err) {
      setProblems(problems.filter(p => p._id !== problemId))
      setDeleteModal(null)
      setActionMsg('Problem deleted (demo).')
      setTimeout(() => setActionMsg(''), 3000)
    }
  }

  const handleResolve = async (e) => {
    e.preventDefault()
    setResolveLoading(true)
    try {
      await api.put(`/disputes/${resolveModal._id}/resolve`, {
        resolution,
        adminNote: resolveNote,
      })
      setDisputes(disputes.map(d =>
        d._id === resolveModal._id ? { ...d, status: 'resolved', resolution, adminNote: resolveNote } : d
      ))
      setResolveModal(null)
      setResolveNote('')
      setActionMsg('Dispute resolved successfully.')
      setTimeout(() => setActionMsg(''), 3000)
    } catch (err) {
      setDisputes(disputes.map(d =>
        d._id === resolveModal._id ? { ...d, status: 'resolved', resolution } : d
      ))
      setResolveModal(null)
      setActionMsg('Dispute resolved (demo).')
      setTimeout(() => setActionMsg(''), 3000)
    } finally {
      setResolveLoading(false)
    }
  }

  const handleResolveTicket = async (ticketId) => {
    try {
      const res = await supportApi.updateTicketStatus(ticketId, { status: 'resolved', adminReply: 'Resolved by Admin' })
      setSupportTickets(tickets => tickets.map(t => t._id === ticketId ? res.ticket : t))
      setActionMsg('Support ticket resolved.')
      setTimeout(() => setActionMsg(''), 3000)
    } catch {
      setActionMsg('Failed to resolve ticket.')
      setTimeout(() => setActionMsg(''), 3000)
    }
  }

  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchUser.toLowerCase())
    const matchRole   = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const openDisputes     = disputes.filter(d => d.status !== 'resolved').length
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved').length

  const tabs = [
    { key: 'overview',  label: <><i className="fi fi-rr-chart-histogram"></i> Overview</>  },
    { key: 'users',     label: <><i className="fi fi-rr-users"></i> Users</>      },
    { key: 'problems',  label: <><i className="fi fi-rr-list-check"></i> Problems</>   },
    { key: 'disputes',  label: <><i className="fi fi-rr-scale-balanced"></i> Disputes {openDisputes > 0 ? `(${openDisputes})` : ''}</> },
    { key: 'support',   label: <><i className="fi fi-rr-headset"></i> Support {supportTickets.filter(t=>t.status==='open').length > 0 ? `(${supportTickets.filter(t=>t.status==='open').length})` : ''}</> },
  ]

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'center', marginBottom: 24, gap: 16 }}>
        <div>
          <h1 style={{ fontSize: isMobile ? 20 : 22, fontWeight: 800, color: text, marginBottom: 3 }}>
            Admin Dashboard 🛡️
          </h1>
          <p style={{ fontSize: 13, color: sub }}>Platform management and analytics</p>
        </div>
        {!isSmall && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => navigate('/profile/edit')} style={{
              background: card, border: `1.5px solid ${border}`, color: text,
              padding: '7px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              👤 Edit Profile
            </button>
            <div style={{ fontSize: 12, background: isDark ? '#3a2e1a' : '#fef3c7', color: isDark ? '#fbbf24' : '#d97706', padding: '6px 14px', borderRadius: 8, fontWeight: 700, border: isDark ? '1px solid #5a4020' : '1px solid #fde68a' }}>
              ⚠️ Admin Access
            </div>
          </div>
        )}
      </div>

      {actionMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
          ✅ {actionMsg}
        </div>
      )}

      {/* Tab bar - scrollable on mobile */}
      <div className="hide-scrollbar" style={{ display: 'flex', gap: 4, background: 'var(--bg-tertiary)', borderRadius: 12, padding: 4, marginBottom: 24, overflowX: 'auto', width: '100%' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => navigate(t.key === 'overview' ? '/admin' : `/admin/${t.key}`)} style={{
            padding: isSmall ? '8px 14px' : '8px 18px', borderRadius: 9, border: 'none', fontSize: 12, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
            background: tab === t.key ? 'var(--bg-secondary)' : 'transparent',
            color: tab === t.key ? 'var(--text-brand)' : 'var(--text-muted)',
            boxShadow: tab === t.key ? 'var(--shadow-card)' : 'none',
            flexShrink: 0,
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && <Spinner />}

      {/* ── OVERVIEW TAB ────────────────────────────────────────────────── */}
      {tab === 'overview' && !loading && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            <StatCard label="Total Users"       value={stats.totalUsers}                   icon={<i className="fi fi-rr-users"></i>} color="#4f46e5" isMobile={isMobile} />
            <StatCard label="Total Problems"    value={stats.totalProblems}                icon={<i className="fi fi-rr-list-check"></i>} color="#2563eb" isMobile={isMobile} />
            <StatCard label="Completed Jobs"    value={stats.totalContracts}               icon={<i className="fi fi-rr-check"></i>} color="#16a34a" isMobile={isMobile} />
            <StatCard label="Total Revenue"     value={formatBDT(stats.totalRevenue || 0)} icon={<i className="fi fi-rr-coins"></i>} color="#d97706" isMobile={isMobile} />
            <StatCard label="Open Disputes"     value={openDisputes}                       icon={<i className="fi fi-rr-scale-balanced"></i>} color="#dc2626" isMobile={isMobile} />
            <StatCard label="Resolved Disputes" value={resolvedDisputes}                   icon={<i className="fi fi-rr-trophy"></i>} color="#0891b2" isMobile={isMobile} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isSmall ? '1fr' : '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 16, padding: isSmall ? 16 : 22 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: text, marginBottom: 16 }}>User Role Distribution</div>
              {[
                { role: 'client', label: 'Clients', color: '#4f46e5', icon: '💼' },
                { role: 'solver', label: 'Solvers', color: '#16a34a', icon: '⚡' },
                { role: 'admin',  label: 'Admins',  color: '#d97706', icon: '🛡️' },
              ].map(r => {
                const count = users.filter(u => u.role === r.role).length
                const pct   = users.length ? Math.round((count / users.length) * 100) : 0
                return (
                  <div key={r.role} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: text }}>{r.icon} {r.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: r.color }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 100 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: r.color, borderRadius: 100 }} />
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 16, padding: isSmall ? 16 : 22 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: text, marginBottom: 16 }}>Problem Status Breakdown</div>
              {[
                { status: 'open',      label: 'Open',        color: '#7c3aed' },
                { status: 'active',    label: 'Active',      color: '#2563eb' },
                { status: 'completed', label: 'Completed',   color: '#16a34a' },
                { status: 'cancelled', label: 'Cancelled',   color: '#dc2626' },
              ].map(s => {
                const count = problems.filter(p => p.status === s.status).length
                const pct   = problems.length ? Math.round((count / problems.length) * 100) : 0
                return (
                  <div key={s.status} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: text }}>{s.label}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-tertiary)', borderRadius: 100 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 100 }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 16, padding: isSmall ? 16 : 22 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: text, marginBottom: 14 }}>Recent Registrations</div>
            {users.slice(0, 5).map(u => (
              <div key={u._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-brand)' }}>
                    {u.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{u.name}</div>
                    {!isMobile && <div style={{ fontSize: 11, color: sub }}>{u.email}</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: u.role === 'solver' ? 'var(--status-review-bg)' : 'var(--status-active-bg)', color: u.role === 'solver' ? 'var(--status-review-color)' : 'var(--status-active-color)', textTransform: 'capitalize' }}>
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── USERS TAB ───────────────────────────────────────────────────── */}
      {tab === 'users' && !loading && (
        <div>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: isMobile ? '100%' : 200 }}>
            <i className="fi fi-rr-search" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, color: sub }}></i>
            <input
              type="text" placeholder="Search..."
              value={searchUser} onChange={e => setSearchUser(e.target.value)}
              style={{ width: '100%', border: `1.5px solid ${border}`, borderRadius: 10, padding: '9px 14px 9px 36px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: inputBg, color: text, boxSizing: 'border-box' }}
            />
          </div>
            <div className="hide-scrollbar" style={{ display: 'flex', gap: 6, overflowX: 'auto', width: isMobile ? '100%' : 'auto' }}>
              {['all', 'client', 'solver'].map(r => (
                <button key={r} onClick={() => setRoleFilter(r)} style={{
                  padding: '9px 16px', borderRadius: 10, border: `1.5px solid ${roleFilter === r ? 'var(--text-brand)' : border}`,
                  background: roleFilter === r ? 'var(--bg-accent)' : card,
                  color: roleFilter === r ? 'var(--text-brand)' : sub,
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize', whiteSpace: 'nowrap'
                }}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 16, overflowX: 'auto' }}>
            <div style={{ minWidth: 600 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', background: 'var(--bg-tertiary)', padding: '10px 20px', borderBottom: `1px solid ${border}` }}>
                {['User', 'Email', 'Role', 'Status', 'Action'].map(h => (
                  <div key={h} style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: 'uppercase' }}>{h}</div>
                ))}
              </div>

              {filteredUsers.map(u => (
                <div key={u._id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: `1px solid ${border}`, alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--text-brand)' }}>{u.name.slice(0, 2).toUpperCase()}</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{u.name}</span>
                  </div>
                  <div style={{ fontSize: 12, color: sub }}>{u.email}</div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: u.role === 'solver' ? 'var(--status-review-bg)' : 'var(--status-active-bg)', color: u.role === 'solver' ? 'var(--status-review-color)' : 'var(--status-active-color)', textTransform: 'capitalize', width: 'fit-content' }}>{u.role}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: u.isBanned ? 'var(--error-bg)' : 'var(--status-done-bg)', color: u.isBanned ? 'var(--error-text)' : 'var(--status-done-color)', width: 'fit-content' }}>{u.isBanned ? 'Banned' : 'Active'}</span>
                  {u.role !== 'admin' ? (
                    <button onClick={() => handleBan(u._id)} style={{ background: u.isBanned ? '#f0fdf4' : '#fef2f2', color: u.isBanned ? '#16a34a' : '#dc2626', border: 'none', padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>{u.isBanned ? 'Unban' : 'Ban'}</button>
                  ) : <span>—</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PROBLEMS TAB ─────────────────────────────────────────────────── */}
      {tab === 'problems' && !loading && (
        <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 16, overflowX: 'auto' }}>
          <div style={{ minWidth: 600 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr', padding: '10px 20px', background: 'var(--bg-tertiary)', borderBottom: `1px solid ${border}` }}>
              {['Title', 'Category', 'Budget', 'Status', 'Action'].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: 'uppercase' }}>{h}</div>
              ))}
            </div>
            {problems.map(p => {
              const ss = statusStyle[p.status] || statusStyle.open
              return (
                <div key={p._id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: `1px solid ${border}`, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: text }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: sub }}>by {p.client?.name}</div>
                  </div>
                  <span style={{ fontSize: 11, color: sub }}>{p.category}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#4f46e5' }}>{formatBDT(p.budget)}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: ss.bg, color: ss.color, textTransform: 'capitalize', width: 'fit-content' }}>{p.status}</span>
                  <button onClick={() => setDeleteModal(p)} style={{ background: '#fef2f2', color: '#dc2626', border: 'none', padding: '5px 12px', borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Delete</button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── DISPUTES TAB ─────────────────────────────────────────────────── */}
      {tab === 'disputes' && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {disputes.map(d => {
            const ss = statusStyle[d.status] || statusStyle.open
            return (
              <div key={d._id} style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 16, padding: isSmall ? 16 : 22 }}>
                <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: ss.bg, color: ss.color }}>{d.status.toUpperCase()}</span>
                      <span style={{ fontSize: 12, color: sub }}>{formatBDT(d.contract?.amount || 0)}</span>
                    </div>
                    <div style={{ fontSize: 12, color: sub }}>Raised by {d.raisedBy?.name} · {formatDate(d.createdAt)}</div>
                  </div>
                  {d.status !== 'resolved' && (
                    <button onClick={() => { setResolveModal(d); setResolution('solver_wins') }} style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Resolve</button>
                  )}
                </div>
                <div style={{ background: 'var(--bg-primary)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: text, lineHeight: 1.6 }}>{d.reason}</div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── SUPPORT TAB ─────────────────────────────────────────────────── */}
      {tab === 'support' && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {supportTickets.map(t => (
            <div key={t._id} style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 16, padding: isSmall ? 16 : 22 }}>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: t.status === 'open' ? '#fef2f2' : '#f0fdf4', color: t.status === 'open' ? '#dc2626' : '#16a34a' }}>{t.status.toUpperCase()}</span>
                    <span style={{ fontSize: 14, fontWeight: 800, color: text }}>{t.subject}</span>
                  </div>
                  <div style={{ fontSize: 12, color: sub }}>From {t.user?.name} · {formatDate(t.createdAt)}</div>
                </div>
                {t.status === 'open' && (
                  <button onClick={() => handleResolveTicket(t._id)} style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>Resolve</button>
                )}
              </div>
              <div style={{ background: 'var(--bg-primary)', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: text, lineHeight: 1.6 }}>{t.message}</div>
            </div>
          ))}
        </div>
      )}

      {/* ─── Delete Problem Modal ────────────────────── */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="🗑️ Delete Problem">
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
          Are you sure you want to delete <strong>{deleteModal?.title}</strong>? This action <strong>cannot be undone</strong> and will remove the problem from the platform.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setDeleteModal(null)}
            style={{ flex: 1, background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-secondary)', padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button onClick={() => handleDeleteProblem(deleteModal._id)}
            style={{ flex: 1, background: '#dc2626', color: '#fff', border: 'none', padding: '10px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Yes, Delete
          </button>
        </div>
      </Modal>

      {/* ─── Resolve Dispute Modal ────────────────────── */}
      <Modal open={!!resolveModal} onClose={() => setResolveModal(null)} title="⚖️ Resolve Dispute">
        <form onSubmit={handleResolve} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Resolution</label>
            <select 
              value={resolution} 
              onChange={e => setResolution(e.target.value)}
              style={{ width: '100%', border: '1.5px solid var(--border-secondary)', borderRadius: 10, padding: '10px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none' }}
            >
              <option value="solver_wins">Solver Wins (Pay Solver)</option>
              <option value="client_wins">Client Wins (Refund Client)</option>
              <option value="split_50_50">Split 50/50</option>
            </select>
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Admin Note (visible to both parties)</label>
            <textarea 
              rows={4}
              value={resolveNote}
              onChange={e => setResolveNote(e.target.value)}
              placeholder="Explain the reason for this decision..."
              style={{ width: '100%', border: '1.5px solid var(--border-secondary)', borderRadius: 10, padding: '12px', background: 'var(--bg-secondary)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical', fontSize: 13 }}
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={resolveLoading}
            style={{ background: '#4f46e5', color: '#fff', border: 'none', padding: '12px', borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: resolveLoading ? 'not-allowed' : 'pointer', opacity: resolveLoading ? 0.7 : 1 }}
          >
            {resolveLoading ? 'Processing...' : 'Confirm Resolution'}
          </button>
        </form>
      </Modal>
    </DashboardLayout>
  )
}
