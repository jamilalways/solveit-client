import { useState } from 'react'
import Modal from './Modal'
import { createReview } from '../../api/reviews.api'

export default function ReviewModal({ open, onClose, contractId, onReviewSuccess }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await createReview({ contractId, rating, comment })
      onReviewSuccess() // Notify parent
      onClose()
      setRating(5)
      setComment('')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="✨ Leave a Review">
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Rating (1-5)</label>
          <div style={{ display: 'flex', gap: 8 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                style={{
                  cursor: 'pointer',
                  fontSize: 24,
                  color: star <= rating ? '#f97316' : 'var(--border-secondary)'
                }}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Comment</label>
          <textarea
            required
            rows={4}
            placeholder="Share your experience working on this contract..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{
              width: '100%', border: '1.5px solid var(--input-border)', borderRadius: 10,
              padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none',
              boxSizing: 'border-box', color: 'var(--text-primary)', background: 'var(--input-bg)',
              resize: 'vertical'
            }}
          />
        </div>
        
        {error && (
          <div style={{ background: 'var(--error-bg)', color: 'var(--error-text)', padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}
        
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%', background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff',
            border: 'none', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit'
          }}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </Modal>
  )
}
