import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Spinner from '../../components/common/Spinner'
import { useAuth } from '../../context/AuthContext'
import { formatBDT } from '../../utils/formatCurrency'
import { formatDate, daysLeft } from '../../utils/formatDate'

const DEMO_JOBS = [
  { _id: '1', title: 'Build a REST API for e-commerce app', category: 'Programming', budget: 3500, deadline: new Date(Date.now() + 3 * 86400000), status: 'active',    bidsCount: 7 },
  { _id: '2', title: 'Design a logo and brand kit',          category: 'Design',      budget: 2000, deadline: new Date(Date.now() + 5 * 86400000), status: 'in_review', bidsCount: 4 },
  { _id: '3', title: 'Automate monthly sales report',        category: 'Data & Excel',budget: 800,  deadline: new Date(Date.now() - 2 * 86400000), status: 'completed', bidsCount: 2 },
  { _id: '4', title: 'Write 5 SEO blog articles',            category: 'Writing',     budget: 1200, deadline: new Date(Date.now() + 10 * 86400000),status: 'open',      bidsCount: 11 },
]

const statusStyle = {
  open:       { bg: '#f5f3ff', color: '#7c3aed', label: 'Open'       },
  active:     { bg: '#eff6ff', color: '#2563eb', label: 'In Progress' },
  in_review:  { bg: '#fffbeb', color: '#d97706', label: 'Under Review'},
  completed:  { bg: '#f0fdf4', color: '#16a34a', label: 'Completed'  },
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs]       = useState(DEMO_JOBS)
  const [loading, setLoading] = useState(false)
  const [wallet, setWallet]   = useState({ balance: 12400, escrow: 5500 })

  const stats = {
    total:     jobs.length,
    active:    jobs.filter((j) => j.status === 'active').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
    open:      jobs.filter((j) => j.status === 'open').length,
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 3 }}>
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: 13, color: '#888' }}>Here's your client overview</p>
        </div>
        <Link to="/post-problem" style={{ background: '#4f46e5', color: '#fff', padding: '10px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          + Post a Problem
        </Link>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total jobs',   value: stats.total,     color: '#4f46e5', bg: '#eef2ff'  },
          { label: 'Active',       value: stats.active,    color: '#2563eb', bg: '#eff6ff'  },
          { label: 'Completed',    value: stats.completed, color: '#16a34a', bg: '#f0fdf4'  },
          { label: 'Awaiting bids',value: stats.open,      color: '#d97706', bg: '#fffbeb'  },
        ].map((s) => (
          <div key={s.label} style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginTop: 6 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Wallet card */}
      <div style={{ background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, color: '#fff' }}>
        <div style={{ fontSize: 12, fontWeight: 700, opacity: .7, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>My Wallet</div>
        <div style={{ display: 'flex', gap: 40 }}>
          <div>
            <div style={{ fontSize: 11, opacity: .7 }}>Available balance</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{formatBDT(wallet.balance)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, opacity: .7 }}>In escrow</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{formatBDT(wallet.escrow)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button style={{ background: 'rgba(255,255,255,.2)', color: '#fff', border: '1px solid rgba(255,255,255,.3)', padding: '7px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            + Deposit
          </button>
          <button style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,.3)', padding: '7px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Withdraw
          </button>
        </div>
      </div>

      {/* Jobs table */}
      <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 16, padding: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e', marginBottom: 16 }}>My Posted Problems</div>
        {loading ? <Spinner /> : (
          <div>
            {jobs.map((job) => {
              const ss = statusStyle[job.status] || statusStyle.open
              return (
                <div key={job._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid #f5f5f8' }}>
                  <div style={{ flex: 1 }}>
                    <Link to={`/problems/${job._id}`} style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.target.style.color = '#4f46e5')}
                      onMouseLeave={(e) => (e.target.style.color = '#1a1a2e')}
                    >{job.title}</Link>
                    <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>
                      {job.category} · {formatBDT(job.budget)} · {daysLeft(job.deadline)} · {job.bidsCount} bids
                    </div>
                  </div>
                  <span style={{ ...ss, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, marginLeft: 16, whiteSpace: 'nowrap' }}>
                    {ss.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}