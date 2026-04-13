import { Link } from 'react-router-dom'
import { daysLeft } from '../../utils/formatDate'
import { formatBDT } from '../../utils/formatCurrency'

const categoryColors = {
  Programming: { bg: '#eff6ff', color: '#2563eb' },
  Design:      { bg: '#fdf4ff', color: '#9333ea' },
  Writing:     { bg: '#f0fdf4', color: '#16a34a' },
  'Data & Excel': { bg: '#fefce8', color: '#ca8a04' },
  'Mobile App':   { bg: '#fff7ed', color: '#ea580c' },
  Security:       { bg: '#fef2f2', color: '#dc2626' },
  'AI / ML':      { bg: '#f0f9ff', color: '#0284c7' },
  'Video / Media':{ bg: '#fdf2f8', color: '#db2777' },
  'Home Services':{ bg: '#ecfdf5', color: '#059669' },
  'Creative Work':{ bg: '#faf5ff', color: '#9333ea' },
  Maintenance:    { bg: '#fffbeb', color: '#b45309' },
  Agriculture:    { bg: '#f0fdf4', color: '#16a34a' },
  Other:          { bg: '#f3f4f6', color: '#4b5563' },
}

export default function ProblemCard({ problem }) {
  const cat = categoryColors[problem.category] || { bg: '#f5f5f5', color: '#555' }
  const dl  = daysLeft(problem.deadline)
  const isUrgent = dl.includes('1 day') || dl === 'Due today'

  return (
    <Link to={`/problems/${problem._id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 16,
        padding: 18, transition: 'all .2s', cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = '#c7d2fe'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,70,229,.08)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f8'; e.currentTarget.style.boxShadow = 'none' }}
      >
        {/* Category badge */}
        <span style={{ ...cat, fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 6, letterSpacing: '.04em', textTransform: 'uppercase' }}>
          {problem.category}
        </span>

        {/* Title */}
        <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e', margin: '10px 0 5px', lineHeight: 1.4 }}>
          {problem.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: 12, color: '#777', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {problem.description}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px solid #f5f5f8' }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: '#4f46e5' }}>
            {formatBDT(problem.budget)}
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ background: '#f0f0ff', color: '#4f46e5', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
              {problem.bidsCount || 0} bids
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: isUrgent ? '#ef4444' : '#f97316' }}>
              {dl}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}