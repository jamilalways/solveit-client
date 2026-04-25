import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../../api/auth.api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      await forgotPassword(email)
      setMessage('A reset link has been sent to your email address.')
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fc', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ padding: '18px 32px', background: '#fff', borderBottom: '1px solid #f0f0f5' }}>
        <Link to="/" style={{ fontSize: 20, fontWeight: 800, color: '#4338ca', textDecoration: 'none' }}>
          Solve<span style={{ color: '#f97316' }}>It</span>
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>Forgot Password? </h1>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 26 }}>Enter your email and we'll send you a link to reset your password.</p>

          {message && (
            <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>Email address</label>
                <input
                  type="email" required placeholder="you@example.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', border: '1.5px solid #e2e2f0', borderRadius: 10, padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#1a1a2e' }}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e)  => (e.target.style.borderColor = '#e2e2f0')}
                />
              </div>

              <button type="submit" disabled={loading} style={{
                width: '100%', background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff',
                border: 'none', padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 700,
                cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              }}>
                {loading ? 'Sending Link...' : 'Send Reset Link →'}
              </button>
            </form>
          )}

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#777' }}>
            Remembered your password?{' '}
            <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
