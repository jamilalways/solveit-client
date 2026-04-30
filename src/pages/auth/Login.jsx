import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const user = await login(form.email, form.password)
      if (user.role === 'client') navigate('/dashboard/client')
      else if (user.role === 'solver') navigate('/dashboard/solver')
      else navigate('/admin')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)' }}>
        <Link to="/" style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-brand)', textDecoration: 'none' }}>
          Solve<span style={{ color: '#f97316' }}>It</span>
        </Link>
        <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--text-brand)', fontWeight: 700, textDecoration: 'none' }}>Sign up free</Link>
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Welcome back </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 26 }}>Log in to your SolveIt account</p>

          {error && (
            <div style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error-text)', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Email address</label>
              <input
                name="email" type="email" required placeholder="you@example.com"
                value={form.email} onChange={handleChange}
                style={{ width: '100%', border: '1.5px solid var(--input-border)', borderRadius: 10, padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: 'var(--text-primary)', background: 'var(--input-bg)' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
                onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  name="password" type={showPassword ? 'text' : 'password'} required placeholder="••••••••"
                  value={form.password} onChange={handleChange}
                  style={{ width: '100%', border: '1.5px solid var(--input-border)', borderRadius: 10, padding: '10px 45px 10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: 'var(--text-primary)', background: 'var(--input-bg)' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
                  onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 16, display: 'flex', alignItems: 'center' }}
                >
                  <i className={showPassword ? "fi fi-rr-eye-crossed" : "fi fi-rr-eye"}></i>
                </button>
              </div>
            </div>

            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <Link to="/forgot-password" style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} style={{
              width: '100%', background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff',
              border: 'none', padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}>
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