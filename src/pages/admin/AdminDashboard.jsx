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
  open:         { bg: '#f5f3ff', color: '#7c3aed' },
  active:       { bg: '#eff6ff', color: '#2563eb' },
  in_review:    { bg: '#fffbeb', color: '#d97706' },
  completed:    { bg: '#f0fdf4', color: '#16a34a' },
  cancelled:    { bg: '#fef2f2', color: '#dc2626' },
  under_review: { bg: '#fff7ed', color: '#ea580c' },
  resolved:     { bg: '#f0fdf4', color: '#16a34a' },
}

// ─── Stat Card ─────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color, dark }) {
  const card  = dark ? '#1a1a2e' : '#fff'
  const border = dark ? '#2a2a3d' : '#f0f0f8'
  const sub    = dark ? '#888'    : '#999'
  const text   = dark ? '#e8e8f0' : '#1a1a2e'
  return (
    <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 14, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 3 }}>{label}</div>
        <div style={{ fontSize: 24, fontWeight: 800, color }}>{value}</div>
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { user }  = useAuth()
  const { dark }  = useTheme()
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
  const bg     = dark ? '#0f0f1a' : '#f8f9fc'
  const card   = dark ? '#1a1a2e' : '#fff'
  const border = dark ? '#2a2a3d' : '#f0f0f8'
  const text   = dark ? '#e8e8f0' : '#1a1a2e'
  const sub    = dark ? '#888'    : '#888'
  const inputBg = dark ? '#0f0f1a' : '#fff'

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

  // ── Ban / Unban user ───────────────────────────────────────────────────
  const handleBan = async (userId) => {
    try {
      const res = await api.put(`/admin/users/${userId}/ban`)
      setUsers(users.map(u => u._id === userId ? { ...u, isBanned: !u.isBanned } : u))
      setActionMsg(res.data.message || 'User status updated.')
      setTimeout(() => setActionMsg(''), 3000)
    } catch (err) {
      // Demo fallback
      setUsers(users.map(u => u._id === userId ? { ...u, isBanned: !u.isBanned } : u))
      setActionMsg('User status updated (demo).')
      setTimeout(() => setActionMsg(''), 3000)
    }
  }

  // ── Delete problem ─────────────────────────────────────────────────────
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

  // ── Resolve dispute ────────────────────────────────────────────────────
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
      // Demo fallback
      setDisputes(disputes.map(d =>
        d._id === resolveModal._id ? { ...d, status: 'resolved', resolution } : d
      ))
      setResolveModal(null)
      setResolveNote('')
      setActionMsg('Dispute resolved (demo).')
      setTimeout(() => setActionMsg(''), 3000)
    } finally {
      setResolveLoading(false)
    }
  }

  // ── Resolve Support Ticket ─────────────────────────────────────────────
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

  // ── Filtered users ─────────────────────────────────────────────────────
  const filteredUsers = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
                        u.email.toLowerCase().includes(searchUser.toLowerCase())
    const matchRole   = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const openDisputes     = disputes.filter(d => d.status !== 'resolved').length
  const resolvedDisputes = disputes.filter(d => d.status === 'resolved').length

  const tabs = [
    { key: 'overview',  label: '📊 Overview'  },
    { key: 'users',     label: '👥 Users'      },
    { key: 'problems',  label: '📋 Problems'   },
    { key: 'disputes',  label: `⚖️ Disputes ${openDisputes > 0 ? `(${openDisputes})` : ''}` },
    { key: 'support',   label: `🎧 Support ${supportTickets.filter(t=>t.status==='open').length > 0 ? `(${supportTickets.filter(t=>t.status==='open').length})` : ''}` },
  ]

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: text, marginBottom: 3 }}>
            Admin Dashboard 🛡️
          </h1>
          <p style={{ fontSize: 13, color: sub }}>Platform management and analytics</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/profile/edit')} style={{
            background: card, border: `1.5px solid ${border}`, color: text,
            padding: '7px 16px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 8,
            transition: 'all .15s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = card}
          >
            👤 Edit Profile
          </button>
          <div style={{ fontSize: 12, background: '#fef3c7', color: '#d97706', padding: '6px 14px', borderRadius: 8, fontWeight: 700, border: '1px solid #fde68a' }}>
            ⚠️ Admin Access
          </div>
        </div>
      </div>

      {/* Action message toast */}
      {actionMsg && (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
          ✅ {actionMsg}
        </div>
      )}

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, background: dark ? '#1a1a2e' : '#f0f0f8', borderRadius: 12, padding: 4, marginBottom: 24, width: 'fit-content', flexWrap: 'wrap' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => navigate(t.key === 'overview' ? '/admin' : `/admin/${t.key}`)} style={{
            padding: '8px 18px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
            background: tab === t.key ? (dark ? '#2a2a50' : '#fff') : 'transparent',
            color: tab === t.key ? '#4f46e5' : sub,
            boxShadow: tab === t.key ? '0 1px 4px rgba(0,0,0,.1)' : 'none',
            transition: 'all .15s',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading && <Spinner />}

      {/* ── OVERVIEW TAB ────────────────────────────────────────────────── */}
      {tab === 'overview' && !loading && (
        <div>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
            <StatCard label="Total Users"       value={stats.totalUsers}                   icon="👥" color="#4f46e5" dark={dark} />
            <StatCard label="Total Problems"    value={stats.totalProblems}                icon="📋" color="#2563eb" dark={dark} />
            <StatCard label="Completed Jobs"    value={stats.totalContracts}               icon="✅" color="#16a34a" dark={dark} />
            <StatCard label="Total Revenue"     value={formatBDT(stats.totalRevenue || 0)} icon="💰" color="#d97706" dark={dark} />
            <StatCard label="Open Disputes"     value={openDisputes}                       icon="⚖️" color="#dc2626" dark={dark} />
            <StatCard label="Resolved Disputes" value={resolvedDisputes}                   icon="🏆" color="#0891b2" dark={dark} />
          </div>

          {/* User breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            {/* Role distribution */}
            <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 16, padding: 22 }}>
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
                    <div style={{ height: 6, background: dark ? '#2a2a3d' : '#f0f0f8', borderRadius: 100 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: r.color, borderRadius: 100, transition: 'width .4s' }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Problem status breakdown */}
            <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 16, padding: 22 }}>
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
                    <div style={{ height: 6, background: dark ? '#2a2a3d' : '#f0f0f8', borderRadius: 100 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 100, transition: 'width .4s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recent users */}
          <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 16, padding: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: text, marginBottom: 14 }}>Recent Registrations</div>
            {users.slice(0, 5).map(u => (
              <div key={u._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>
                    {u.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: text }}>{u.name}</div>
                    <div style={{ fontSize: 11, color: sub }}>{u.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: u.role === 'solver' ? '#fff7ed' : '#eff6ff', color: u.role === 'solver' ? '#ea580c' : '#2563eb', textTransform: 'capitalize' }}>
                    {u.role}
                  </span>
                  <span style={{ fontSize: 11, color: sub }}>{formatDate(u.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── USERS TAB ───────────────────────────────────────────────────── */}
      {tab === 'users' && !loading && (
        <div>
          {/* Search + filter bar */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <input
              type="text" placeholder="🔍 Search by name or email..."
              value={searchUser} onChange={e => setSearchUser(e.target.value)}
              style={{ flex: 1, minWidth: 200, border: `1.5px solid ${border}`, borderRadius: 10, padding: '9px 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none', background: inputBg, color: text }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = border}
            />
            {['all', 'client', 'solver', 'admin'].map(r => (
              <button key={r} onClick={() => setRoleFilter(r)} style={{
                padding: '9px 16px', borderRadius: 10, border: `1.5px solid ${roleFilter === r ? '#4f46e5' : border}`,
                background: roleFilter === r ? '#eef2ff' : (dark ? '#1a1a2e' : '#fff'),
                color: roleFilter === r ? '#4f46e5' : sub,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
              }}>
                {r === 'all' ? 'All roles' : r}
              </button>
            ))}
            <span style={{ fontSize: 12, color: sub, alignSelf: 'center' }}>{filteredUsers.length} users</span>
          </div>

          {/* Users table */}
          <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 16, overflow: 'hidden' }}>
            {/* Table header */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', gap: 0, background: dark ? '#1e1e30' : '#f8f9fc', padding: '10px 20px', borderBottom: `1px solid ${border}` }}>
              {['User', 'Email', 'Role', 'Status', 'Joined', 'Action'].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</div>
              ))}
            </div>

            {filteredUsers.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: sub }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>🔍</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>No users found</div>
              </div>
            ) : filteredUsers.map(u => (
              <div key={u._id} style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 1fr', gap: 0, padding: '14px 20px', borderBottom: `1px solid ${border}`, alignItems: 'center' }}>
                {/* Name + avatar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#4f46e5', flexShrink: 0 }}>
                    {u.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: text }}>{u.name}</span>
                </div>
                {/* Email */}
                <div style={{ fontSize: 12, color: sub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                {/* Role */}
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: u.role === 'solver' ? '#fff7ed' : u.role === 'admin' ? '#fef3c7' : '#eff6ff', color: u.role === 'solver' ? '#ea580c' : u.role === 'admin' ? '#d97706' : '#2563eb', display: 'inline-block', textTransform: 'capitalize', width: 'fit-content' }}>
                  {u.role}
                </span>
                {/* Status */}
                <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: u.isBanned ? '#fef2f2' : '#f0fdf4', color: u.isBanned ? '#dc2626' : '#16a34a', display: 'inline-block', width: 'fit-content' }}>
                  {u.isBanned ? 'Banned' : 'Active'}
                </span>
                {/* Joined */}
                <div style={{ fontSize: 11, color: sub }}>{formatDate(u.createdAt)}</div>
                {/* Action */}
                {u.role !== 'admin' ? (
                  <button onClick={() => handleBan(u._id)} style={{
                    background: u.isBanned ? '#f0fdf4' : '#fef2f2',
                    color: u.isBanned ? '#16a34a' : '#dc2626',
                    border: 'none', padding: '5px 12px', borderRadius: 7,
                    fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    width: 'fit-content',
                  }}>
                    {u.isBanned ? '✅ Unban' : '🚫 Ban'}
                  </button>
                ) : (
                  <span style={{ fontSize: 11, color: sub }}>— Admin —</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── PROBLEMS TAB ─────────────────────────────────────────────────── */}
      {tab === 'problems' && !loading && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{problems.length} total problems on platform</div>
          </div>

          <div style={{ background: card, border: `1.5px solid ${border}`, borderRadius: 16, overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr', padding: '10px 20px', background: dark ? '#1e1e30' : '#f8f9fc', borderBottom: `1px solid ${border}` }}>
              {['Title', 'Category', 'Budget', 'Status', 'Action'].map(h => (
                <div key={h} style={{ fontSize: 11, fontWeight: 700, color: sub, textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</div>
              ))}
            </div>

            {problems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: sub }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>📭</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>No problems found</div>
              </div>
            ) : problems.map(p => {
              const ss = statusStyle[p.status] || statusStyle.open
              return (
                <div key={p._id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 1fr 1fr', padding: '14px 20px', borderBottom: `1px solid ${border}`, alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 2 }}>{p.title}</div>
                    <div style={{ fontSize: 11, color: sub }}>by {p.client?.name || 'Unknown'} · {formatDate(p.createdAt)}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: sub }}>{p.category}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#4f46e5' }}>
                    {p.budgetType === 'range' && p.budgetMax ? `${formatBDT(p.budget)} - ${formatBDT(p.budgetMax).replace('৳ ', '')}` : formatBDT(p.budget)}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: ss.bg, color: ss.color, display: 'inline-block', textTransform: 'capitalize', width: 'fit-content' }}>
                    {p.status}
                  </span>
                  <button onClick={() => setDeleteModal(p)} style={{
                    background: '#fef2f2', color: '#dc2626', border: 'none',
                    padding: '5px 12px', borderRadius: 7, fontSize: 11,
                    fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                  }}>
                    🗑 Delete
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── DISPUTES TAB ─────────────────────────────────────────────────── */}
      {tab === 'disputes' && !loading && (
        <div>
          {/* Dispute filter pills */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            {[
              { label: `All (${disputes.length})`,                       value: 'all'         },
              { label: `Open (${disputes.filter(d=>d.status==='open').length})`,         value: 'open'        },
              { label: `Under review (${disputes.filter(d=>d.status==='under_review').length})`, value: 'under_review'},
              { label: `Resolved (${disputes.filter(d=>d.status==='resolved').length})`, value: 'resolved'    },
            ].map(f => (
              <button key={f.value} onClick={() => setTab('disputes_' + f.value)} style={{
                padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${border}`,
                background: dark ? '#1a1a2e' : '#fff', color: sub,
                fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                {f.label}
              </button>
            ))}
          </div>

          {disputes.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: sub, background: card, borderRadius: 16, border: `1.5px solid ${border}` }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>⚖️</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: text }}>No disputes found</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>The platform is running smoothly</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {disputes.map(d => {
                const ss = statusStyle[d.status] || statusStyle.open
                return (
                  <div key={d._id} style={{ background: card, border: `1.5px solid ${d.status === 'open' ? '#fecaca' : d.status === 'under_review' ? '#fed7aa' : border}`, borderRadius: 16, padding: 22 }}>
                    {/* Header row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: ss.bg, color: ss.color }}>
                            {d.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span style={{ fontSize: 12, color: sub }}>Contract amount: <strong style={{ color: '#4f46e5' }}>{formatBDT(d.contract?.amount || 0)}</strong></span>
                        </div>
                        <div style={{ fontSize: 13, color: sub }}>
                          Raised by: <strong style={{ color: text }}>{d.raisedBy?.name}</strong> ({d.raisedBy?.role}) · {formatDate(d.createdAt)}
                        </div>
                      </div>

                      {/* Resolve button — only for open/under_review */}
                      {d.status !== 'resolved' && (
                        <button onClick={() => { setResolveModal(d); setResolution('solver_wins'); setResolveNote('') }} style={{
                          background: '#4f46e5', color: '#fff', border: 'none',
                          padding: '8px 18px', borderRadius: 10, fontSize: 13,
                          fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                          flexShrink: 0,
                        }}>
                          ⚖️ Resolve
                        </button>
                      )}
                    </div>

                    {/* Reason */}
                    <div style={{ background: dark ? '#0f0f1a' : '#f8f9fc', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: text, lineHeight: 1.7, marginBottom: d.resolution ? 10 : 0 }}>
                      <span style={{ fontWeight: 700, color: sub, fontSize: 11, display: 'block', marginBottom: 4 }}>REASON</span>
                      {d.reason}
                    </div>

                    {/* Resolution note if resolved */}
                    {d.status === 'resolved' && d.adminNote && (
                      <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#16a34a', marginTop: 10 }}>
                        <span style={{ fontWeight: 700, display: 'block', marginBottom: 2, fontSize: 11 }}>ADMIN RESOLUTION</span>
                        {d.adminNote}
                      </div>
                    )}

                    {d.status === 'resolved' && d.resolution && (
                      <div style={{ marginTop: 8, fontSize: 12, color: sub }}>
                        Outcome: <strong style={{ color: '#16a34a' }}>{d.resolution?.replace('_', ' ')}</strong>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── SUPPORT TAB ─────────────────────────────────────────────────── */}
      {tab === 'support' && !loading && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: text }}>{supportTickets.length} Support Tickets</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {supportTickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: sub, background: card, borderRadius: 16, border: `1.5px solid ${border}` }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>🎧</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>No support tickets found</div>
              </div>
            ) : supportTickets.map(t => {
              const isOpen = t.status === 'open'
              return (
                <div key={t._id} style={{ background: card, border: `1.5px solid ${isOpen ? '#fecaca' : border}`, borderRadius: 16, padding: 22 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: isOpen ? '#fef2f2' : '#f0fdf4', color: isOpen ? '#dc2626' : '#16a34a' }}>
                          {t.status.toUpperCase()}
                        </span>
                        <span style={{ fontSize: 14, fontWeight: 800, color: text }}>{t.subject}</span>
                      </div>
                      <div style={{ fontSize: 13, color: sub }}>
                        From: <strong style={{ color: text }}>{t.user?.name}</strong> ({t.user?.role}) · {formatDate(t.createdAt)}
                      </div>
                    </div>
                    {isOpen && (
                      <button onClick={() => handleResolveTicket(t._id)} style={{
                        background: '#16a34a', color: '#fff', border: 'none',
                        padding: '8px 18px', borderRadius: 10, fontSize: 13,
                        fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                      }}>
                        ✅ Mark Resolved
                      </button>
                    )}
                  </div>
                  <div style={{ background: dark ? '#0f0f1a' : '#f8f9fc', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: text, lineHeight: 1.7 }}>
                    <span style={{ fontWeight: 700, color: sub, fontSize: 11, display: 'block', marginBottom: 4 }}>MESSAGE</span>
                    {t.message}
                  </div>
                  {t.status === 'resolved' && (
                    <div style={{ fontSize: 12, color: '#16a34a', marginTop: 10, fontWeight: 600 }}>
                      ✓ {t.adminReply || 'Resolved by Admin'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── RESOLVE DISPUTE MODAL ────────────────────────────────────────── */}
      <Modal open={!!resolveModal} onClose={() => setResolveModal(null)} title="Resolve Dispute">
        {resolveModal && (
          <form onSubmit={handleResolve}>
            {/* Dispute summary */}
            <div style={{ background: '#fef2f2', borderRadius: 10, padding: '12px 14px', marginBottom: 16, fontSize: 13, color: '#dc2626', lineHeight: 1.6 }}>
              <strong>Contract amount: {formatBDT(resolveModal.contract?.amount || 0)}</strong>
              <br />Raised by: {resolveModal.raisedBy?.name} ({resolveModal.raisedBy?.role})
            </div>

            {/* Reason display */}
            <div style={{ background: '#f8f9fc', borderRadius: 10, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#555', lineHeight: 1.7 }}>
              {resolveModal.reason}
            </div>

            {/* Resolution choice */}
            <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 8 }}>Resolution Outcome *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              {[
                { value: 'solver_wins', icon: '⚡', label: 'Solver wins', desc: 'Release escrow to solver' },
                { value: 'client_wins', icon: '💼', label: 'Client wins', desc: 'Refund escrow to client' },
              ].map(opt => (
                <div key={opt.value} onClick={() => setResolution(opt.value)} style={{
                  border: `2px solid ${resolution === opt.value ? '#4f46e5' : '#e2e2f0'}`,
                  background: resolution === opt.value ? '#eef2ff' : '#fff',
                  borderRadius: 12, padding: '12px 14px', cursor: 'pointer', textAlign: 'center', transition: 'all .15s',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{opt.icon}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{opt.label}</div>
                  <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>{opt.desc}</div>
                </div>
              ))}
            </div>

            {/* Admin note */}
            <label style={{ fontSize: 12, fontWeight: 700, color: '#555', display: 'block', marginBottom: 6 }}>Admin Note (optional)</label>
            <textarea
              rows={3} value={resolveNote}
              placeholder="Explain your decision to both parties..."
              onChange={e => setResolveNote(e.target.value)}
              style={{ width: '100%', border: '1.5px solid #e2e2f0', borderRadius: 10, padding: '10px 13px', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical', marginBottom: 16 }}
              onFocus={e => e.target.style.borderColor = '#6366f1'}
              onBlur={e => e.target.style.borderColor = '#e2e2f0'}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={() => setResolveModal(null)} style={{ flex: 1, background: '#f5f5f8', color: '#555', border: 'none', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Cancel
              </button>
              <button type="submit" disabled={resolveLoading} style={{ flex: 2, background: resolveLoading ? '#a5b4fc' : '#4f46e5', color: '#fff', border: 'none', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: resolveLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                {resolveLoading ? 'Resolving...' : `⚖️ Confirm — ${resolution === 'solver_wins' ? 'Pay Solver' : 'Refund Client'}`}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ── DELETE PROBLEM CONFIRM MODAL ─────────────────────────────────── */}
      <Modal open={!!deleteModal} onClose={() => setDeleteModal(null)} title="Delete Problem">
        <p style={{ fontSize: 14, color: '#555', marginBottom: 20, lineHeight: 1.6 }}>
          Are you sure you want to permanently delete <strong>"{deleteModal?.title}"</strong>? This cannot be undone.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setDeleteModal(null)} style={{ flex: 1, background: '#f5f5f8', color: '#555', border: 'none', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button onClick={() => handleDeleteProblem(deleteModal._id)} style={{ flex: 1, background: '#dc2626', color: '#fff', border: 'none', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Yes, Delete
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
