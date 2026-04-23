import { useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { resetPassword } from '../../api/auth.api'
import { useAuth } from '../../context/AuthContext'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) return setError('Passwords do not match.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')

    setLoading(true)
    setError('')
    try {
      const res = await resetPassword(token, password)
      // Automatically log the user in after reset
      localStorage.setItem('token', res.data.token)
      setUser(res.data.user)
      navigate(res.data.user.role === 'client' ? '/dashboard/client' : '/dashboard/solver')
    } catch (err) {
      setError(err.response?.data?.message || 'Token is invalid or has expired.')
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
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>Reset Password 🔐</h1>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 26 }}>Enter your new password below.</p>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>New Password</label>
              <input
                type="password" required placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', border: '1.5px solid #e2e2f0', borderRadius: 10, padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#1a1a2e' }}
                onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                onBlur={(e)  => (e.target.style.borderColor = '#e2e2f0')}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>Confirm Password</label>
              <input
                type="password" required placeholder="••••••••"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
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
              {loading ? 'Resetting...' : 'Reset Password →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#777' }}>
            Back to{' '}
            <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
