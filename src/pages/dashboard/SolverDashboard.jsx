import { useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { formatBDT } from '../../utils/formatCurrency'

const DEMO_JOBS = [
  { _id: '1', title: 'REST API for e-commerce app', client: 'Arif Khan',    amount: 3500, status: 'active',    deadline: new Date(Date.now() + 3 * 86400000) },
  { _id: '2', title: 'Python data scraper',          client: 'Tasnim Ahmed', amount: 1800, status: 'in_review', deadline: new Date(Date.now() + 1 * 86400000) },
  { _id: '3', title: 'Fix login bug in React app',   client: 'Rafiq Mia',   amount: 600,  status: 'completed', deadline: new Date(Date.now() - 2 * 86400000) },
  { _id: '4', title: 'Excel VBA automation',         client: 'Karim Uddin',  amount: 800,  status: 'completed', deadline: new Date(Date.now() - 5 * 86400000) },
]

const DEMO_BIDS = [
  { _id: 'b1', title: 'Mobile UI design for food app', proposedPrice: 2800, status: 'pending',  createdAt: new Date(Date.now() - 86400000) },
  { _id: 'b2', title: 'SEO blog writing (5 articles)', proposedPrice: 1200, status: 'rejected', createdAt: new Date(Date.now() - 2 * 86400000) },
]

const statusStyle = {
  active:     { bg: '#eff6ff', color: '#2563eb', label: 'In Progress' },
  in_review:  { bg: '#fffbeb', color: '#d97706', label: 'Under Review' },
  completed:  { bg: '#f0fdf4', color: '#16a34a', label: 'Completed'   },
  pending:    { bg: '#f5f3ff', color: '#7c3aed', label: 'Pending'     },
  rejected:   { bg: '#fef2f2', color: '#dc2626', label: 'Rejected'    },
}

export default function SolverDashboard() {
  const { user } = useAuth()
  const totalEarned = DEMO_JOBS.filter((j) => j.status === 'completed').reduce((s, j) => s + j.amount, 0)

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 3 }}>
            Welcome back, {user?.name?.split(' ')[0]} ⚡
          </h1>
          <p style={{ fontSize: 13, color: '#888' }}>Your solver overview</p>
        </div>
        <Link to="/problems" style={{ background: '#4f46e5', color: '#fff', padding: '10px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          Browse Problems →
        </Link>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Active jobs',    value: DEMO_JOBS.filter(j => j.status === 'active').length,    color: '#2563eb' },
          { label: 'Completed',      value: DEMO_JOBS.filter(j => j.status === 'completed').length, color: '#16a34a' },
          { label: 'Total earned',   value: formatBDT(totalEarned),                                 color: '#4f46e5' },
          { label: 'Avg rating',     value: `4.8 ★`,                                                color: '#f97316' },
        ].map((s) => (
          <div key={s.label} style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
            <div style={{ fontSize: s.label === 'Total earned' ? 18 : 28, fontWeight: 800, color: s.color, marginTop: 6 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Active jobs */}
      <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e', marginBottom: 16 }}>Active Jobs</div>
        {DEMO_JOBS.filter((j) => j.status !== 'completed').map((job) => {
          const ss = statusStyle[job.status]
          return (
            <div key={job._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #f5f5f8' }}>
              <div>
                <Link to={`/contracts/${job._id}`} style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', textDecoration: 'none' }}
                  onMouseEnter={(e) => (e.target.style.color = '#4f46e5')}
                  onMouseLeave={(e) => (e.target.style.color = '#1a1a2e')}
                >{job.title}</Link>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>
                  Client: {job.client} · {formatBDT(job.amount)}
                </div>
              </div>
              <span style={{ ...ss, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, marginLeft: 16 }}>
                {ss.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* My bids */}
      <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e', marginBottom: 16 }}>Recent Bids</div>
        {DEMO_BIDS.map((bid) => {
          const ss = statusStyle[bid.status]
          return (
            <div key={bid._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid #f5f5f8' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{bid.title}</div>
                <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>Proposed: {formatBDT(bid.proposedPrice)}</div>
              </div>
              <span style={{ ...ss, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6 }}>
                {ss.label}
              </span>
            </div>
          )
        })}
      </div>
    </DashboardLayout>
  )
}