import { formatBDT } from '../../utils/formatCurrency'
import { timeAgo } from '../../utils/formatDate'

export default function BidCard({ bid, onAccept, onReject, isClient }) {
  const statusColors = {
    pending:  { bg: '#f5f3ff', color: '#7c3aed' },
    accepted: { bg: '#f0fdf4', color: '#16a34a' },
    rejected: { bg: '#fef2f2', color: '#dc2626' },
  }
  const sc = statusColors[bid.status] || statusColors.pending

  return (
    <div style={{
      background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 14,
      padding: 18, fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        {/* Solver info */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12, background: '#eef2ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#4f46e5', flexShrink: 0,
          }}>
            {bid.solver?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{bid.solver?.name}</div>
            <div style={{ fontSize: 11, color: '#f97316', marginTop: 2 }}>
              {'★'.repeat(Math.round(bid.solver?.avgRating || 0))}
              <span style={{ color: '#aaa', marginLeft: 4 }}>({bid.solver?.avgRating?.toFixed(1) || 'New'})</span>
            </div>
          </div>
        </div>

        {/* Status */}
        <span style={{ ...sc, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6 }}>
          {bid.status}
        </span>
      </div>

      {/* Message */}
      <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, margin: '12px 0', background: '#f8f9fc', borderRadius: 10, padding: '10px 14px' }}>
        {bid.message}
      </p>

      {/* Bid details */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: '#999', fontWeight: 600 }}>Proposed price</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#4f46e5' }}>{formatBDT(bid.proposedPrice)}</div>
        </div>
        <div>
          <div style={{ fontSize: 11, color: '#999', fontWeight: 600 }}>Delivery</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{bid.deliveryDays} days</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#ccc' }}>{timeAgo(bid.createdAt)}</div>
        </div>
      </div>

      {/* Action buttons — only for client, only if pending */}
      {isClient && bid.status === 'pending' && (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onAccept(bid._id)} style={{
            background: '#4f46e5', color: '#fff', border: 'none', padding: '8px 20px',
            borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Accept Bid
          </button>
          <button onClick={() => onReject(bid._id)} style={{
            background: '#fff', color: '#dc2626', border: '1.5px solid #fecaca',
            padding: '8px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Reject
          </button>
        </div>
      )}
    </div>
  )
}