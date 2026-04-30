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
        background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16,
        padding: 18, transition: 'all .2s', cursor: 'pointer',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-brand)'; e.currentTarget.style.boxShadow = 'var(--shadow-card)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.boxShadow = 'none' }}
      >
        {/* Category badge */}
        <span style={{ 
          background: cat.bg, 
          color: cat.color, 
          fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 6, letterSpacing: '.04em', textTransform: 'uppercase',
          filter: document.documentElement.getAttribute('data-theme') === 'dark' ? 'brightness(0.9) contrast(1.2)' : 'none'
        }}>
          {problem.category}
        </span>

        {/* Title */}
        <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', margin: '10px 0 5px', lineHeight: 1.4 }}>
          {problem.title}
        </h3>

        {/* Description */}
        <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {problem.description}
        </p>

        {/* Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, paddingTop: 12, borderTop: '1px solid var(--border-light)' }}>
          <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-brand)' }}>
            {problem.budgetType === 'range' && problem.budgetMax
              ? `${formatBDT(problem.budget)} - ${formatBDT(problem.budgetMax).replace('৳ ', '')}`
              : formatBDT(problem.budget)}
          </span>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ background: 'var(--bg-accent)', color: 'var(--text-brand)', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 600 }}>
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