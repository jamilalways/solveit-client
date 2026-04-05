import { useState } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { formatBDT } from '../../utils/formatCurrency'
import { formatDate } from '../../utils/formatDate'

const DEMO_USERS = [
  { _id: 'u1', name: 'Arif Khan',    email: 'arif@example.com',   role: 'client', status: 'active',  joined: new Date(Date.now() - 30 * 86400000) },
  { _id: 'u2', name: 'Samin Reza',   email: 'samin@example.com',  role: 'solver', status: 'active',  joined: new Date(Date.now() - 20 * 86400000) },
  { _id: 'u3', name: 'Rafiq Mia',    email: 'rafiq@example.com',  role: 'client', status: 'banned',  joined: new Date(Date.now() - 15 * 86400000) },
  { _id: 'u4', name: 'Tasnim Ahmed', email: 'tasnim@example.com', role: 'solver', status: 'active',  joined: new Date(Date.now() - 10 * 86400000) },
]

const DEMO_DISPUTES = [
  { _id: 'd1', contract: 'REST API project',     raisedBy: 'Arif Khan',    reason: 'Solver delivered incomplete work',   status: 'open',     createdAt: new Date(Date.now() - 86400000) },
  { _id: 'd2', contract: 'Logo design project',  raisedBy: 'Samin Reza',   reason: 'Client not responding for 5 days',   status: 'open',     createdAt: new Date(Date.now() - 2 * 86400000) },
  { _id: 'd3', contract: 'Excel automation',     raisedBy: 'Karim Uddin',  reason: 'Deliverable did not match brief',     status: 'resolved', createdAt: new Date(Date.now() - 5 * 86400000) },
]

export default function AdminDashboard() {
  const [tab, setTab]             = useState('overview')
  const [users, setUsers]         = useState(DEMO_USERS)
  const [disputes, setDisputes]   = useState(DEMO_DISPUTES)

  const handleBan = (id) => {
    setUsers((u) => u.map((x) => x._id === id ? { ...x, status: x.status === 'banned' ? 'active' : 'banned' } : x))
  }
  const handleResolve = (id) => {
    setDisputes((d) => d.map((x) => x._id === id ? { ...x, status: 'resolved' } : x))
  }

  const tabs = ['overview', 'users', 'disputes']

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>Admin Dashboard</h1>
        <p style={{ fontSize: 13, color: '#888' }}>Platform overview and management</p>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 4, background: '#f0f0f8', borderRadius: 12, padding: 4, marginBottom: 24, width: 'fit-content' }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '7px 20px', borderRadius: 9, border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', textTransform: 'capitalize',
            background: tab === t ? '#fff' : 'transparent',
            color: tab === t ? '#4f46e5' : '#777',
            boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,.08)' : 'none',
          }}>{t}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Total users',    value: 840,             color: '#4f46e5' },
              { label: 'Total problems', value: 312,             color: '#2563eb' },
              { label: 'Total revenue',  value: formatBDT(240000), color: '#16a34a' },
              { label: 'Open disputes',  value: 2,               color: '#dc2626' },
            ].map((s) => (
              <div key={s.label} style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 14, padding: '18px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
                <div style={{ fontSize: s.label === 'Total revenue' ? 18 : 28, fontWeight: 800, color: s.color, marginTop: 6 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Recent activity */}
          <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>Recent disputes</div>
            {disputes.slice(0, 3).map((d) => (
              <div key={d._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '11px 0', borderBottom: '1px solid #f5f5f8', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{d.contract}</div>
                  <div style={{ fontSize: 11, color: '#aaa' }}>{d.reason} · {d.raisedBy}</div>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, background: d.status === 'open' ? '#fef2f2' : '#f0fdf4', color: d.status === 'open' ? '#dc2626' : '#16a34a' }}>
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* USERS */}
      {tab === 'users' && (
        <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 16 }}>All Users ({users.length})</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1.5px solid #f0f0f8' }}>
                {['Name', 'Email', 'Role', 'Status', 'Joined', 'Action'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 10px', fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.05em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} style={{ borderBottom: '1px solid #f5f5f8' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 600 }}>{u.name}</td>
                  <td style={{ padding: '12px 10px', color: '#888' }}>{u.email}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ background: u.role === 'solver' ? '#fff7ed' : '#eff6ff', color: u.role === 'solver' ? '#ea580c' : '#2563eb', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px' }}>
                    <span style={{ background: u.status === 'active' ? '#f0fdf4' : '#fef2f2', color: u.status === 'active' ? '#16a34a' : '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>
                      {u.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px 10px', color: '#888' }}>{formatDate(u.joined)}</td>
                  <td style={{ padding: '12px 10px' }}>
                    <button onClick={() => handleBan(u._id)} style={{
                      background: u.status === 'banned' ? '#f0fdf4' : '#fef2f2',
                      color: u.status === 'banned' ? '#16a34a' : '#dc2626',
                      border: 'none', borderRadius: 7, padding: '4px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                      {u.status === 'banned' ? 'Unban' : 'Ban'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DISPUTES */}
      {tab === 'disputes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {disputes.map((d) => (
            <div key={d._id} style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 14, padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{d.contract}</div>
                  <div style={{ fontSize: 12, color: '#888', marginTop: 3 }}>Raised by: {d.raisedBy} · {formatDate(d.createdAt)}</div>
                  <div style={{ fontSize: 13, color: '#555', marginTop: 8, background: '#f8f9fc', padding: '8px 12px', borderRadius: 8 }}>{d.reason}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginLeft: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, textAlign: 'center', background: d.status === 'open' ? '#fef2f2' : '#f0fdf4', color: d.status === 'open' ? '#dc2626' : '#16a34a' }}>
                    {d.status}
                  </span>
                  {d.status === 'open' && (
                    <button onClick={() => handleResolve(d._id)} style={{
                      background: '#4f46e5', color: '#fff', border: 'none',
                      padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                    }}>
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}