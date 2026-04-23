import { timeAgo } from '../../utils/formatDate'

export default function ReviewCard({ review }) {
  return (
    <div style={{
      background: '#fff', border: '1.5px solid #f0f0f8',
      borderRadius: 14, padding: 18,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, background: '#eef2ff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 700, color: '#4f46e5',
          }}>
            {review.reviewer?.name?.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{review.reviewer?.name}</div>
            <div style={{ fontSize: 11, color: '#aaa' }}>{timeAgo(review.createdAt)}</div>
          </div>
        </div>
        <div style={{ fontSize: 14, color: '#f97316', fontWeight: 700 }}>
          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
        </div>
      </div>
      <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, margin: 0 }}>{review.comment}</p>
    </div>
  )
}