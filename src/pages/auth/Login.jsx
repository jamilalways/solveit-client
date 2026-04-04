import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Replace with real API call later:
      // const res = await api.post('/auth/login', form)
      // localStorage.setItem('token', res.data.token)
      setTimeout(() => {
        setLoading(false)
        navigate('/')
      }, 1000)
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || 'Login failed. Try again.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fc', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Top bar */}
      <div style={{ padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: 20, fontWeight: 800, color: '#4338ca', textDecoration: 'none' }}>
          Solve<span style={{ color: '#f97316' }}>It</span>
        </Link>
        <span style={{ fontSize: 13, color: '#888' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Sign up free</Link>
        </span>
      </div>

      {/* Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 420 }}>

          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>Welcome back 👋</h1>
            <p style={{ fontSize: 13, color: '#888' }}>Log in to your SolveIt account</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>Email address</label>
              <input
                name="email" type="email" required
                placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                style={{ width: '100%', border: '1.5px solid #e2e2f0', borderRadius: 10, padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e2f0'}
              />
            </div>

            <div style={{ marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>Password</label>
              <input
                name="password" type="password" required
                placeholder="••••••••"
                value={form.password} onChange={handleChange}
                style={{ width: '100%', border: '1.5px solid #e2e2f0', borderRadius: 10, padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#6366f1'}
                onBlur={e => e.target.style.borderColor = '#e2e2f0'}
              />
            </div>

            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}>Forgot password?</span>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff', border: 'none', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
              {loading ? 'Logging in...' : 'Log in →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#777' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Sign up free</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
