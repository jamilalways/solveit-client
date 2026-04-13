import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatBDT } from '../../utils/formatCurrency'
import { timeAgo } from '../../utils/formatDate'
import { startConversation } from '../../api/dm.api'

export default function BidCard({ bid, onAccept, onReject, isClient }) {
  const navigate = useNavigate()
  const [msgLoading, setMsgLoading] = useState(false)

  const statusColors = {
    pending:  { bg: 'var(--status-open-bg)', color: 'var(--status-open-color)' },
    accepted: { bg: 'var(--status-done-bg)', color: 'var(--status-done-color)' },
    rejected: { bg: 'var(--error-bg)', color: 'var(--error-text)' },
  }
  const sc = statusColors[bid.status] || statusColors.pending

  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'

  const handleMessage = async () => {
    setMsgLoading(true)
    try {
      const res = await startConversation(bid.solver._id)
      navigate(`/messages/${res.data.conversation._id}`)
    } catch {
      // ignore
    } finally {
      setMsgLoading(false)
    }
  }

  return (
    <div style={{
      background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 14,
      padding: 18, fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Solver info */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {bid.solver?.avatar ? (
            <img 
              src={bid.solver.avatar.startsWith('http') ? bid.solver.avatar : `${apiBase}${bid.solver.avatar}`} 
              alt={bid.solver.name} 
              style={{ width: 42, height: 42, borderRadius: 12, objectFit: 'cover', flexShrink: 0 }} 
            />
          ) : (
            <div style={{
              width: 42, height: 42, borderRadius: 12, background: 'var(--bg-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'var(--text-brand)', flexShrink: 0,
            }}>
              {bid.solver?.name?.slice(0, 2).toUpperCase() || 'S'}
            </div>
          )}
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{bid.solver?.name}</div>
            <div style={{ fontSize: 11, color: '#f97316', marginTop: 2 }}>
              {'★'.repeat(Math.round(bid.solver?.avgRating || 0))}
              <span style={{ color: 'var(--text-muted)', marginLeft: 4 }}>({bid.solver?.avgRating?.toFixed(1) || 'New'})</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <span style={{ ...sc, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6 }}>
          {bid.status}
        </span>
      </div>

      {/* Message */}
      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, margin: '12px 0', background: 'var(--bg-tertiary)', borderRadius: 10, padding: '10px 14px' }}>
        {bid.message}
      </p>

      {/* Bid details */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Proposed price</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-brand)' }}>{formatBDT(bid.proposedPrice)}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', fontWeight: 600 }}>Delivery</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{bid.deliveryDays} days</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>{timeAgo(bid.createdAt)}</div>
        </div>
      </div>

      {/* Action buttons — only for client, only if pending */}
      {isClient && bid.status === 'pending' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onAccept(bid._id)} style={{
            background: 'var(--color-primary-600)', color: '#fff', border: 'none', padding: '8px 20px',
            borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Accept Bid
          </button>
          <button onClick={handleMessage} disabled={msgLoading} style={{
            background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1.5px solid var(--border-secondary)',
            padding: '8px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            cursor: msgLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
          }}>
            {msgLoading ? 'Opening...' : '💬 Message Solver'}
          </button>
          <button onClick={() => onReject(bid._id)} style={{
            background: 'var(--bg-card)', color: 'var(--error-text)', border: 'none', marginLeft: 'auto',
            padding: '8px 12px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Reject
          </button>
        </div>
      )}
    </div>
  )
}