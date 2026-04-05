import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

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
    <div style={{ minHeight: '100vh', background: '#f8f9fc', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <div style={{ padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', borderBottom: '1px solid #f0f0f5' }}>
        <Link to="/" style={{ fontSize: 20, fontWeight: 800, color: '#4338ca', textDecoration: 'none' }}>
          Solve<span style={{ color: '#f97316' }}>It</span>
        </Link>
        <span style={{ fontSize: 13, color: '#888' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Sign up free</Link>
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>Welcome back 👋</h1>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 26 }}>Log in to your SolveIt account</p>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { name: 'email',    label: 'Email address', type: 'email',    placeholder: 'you@example.com' },
              { name: 'password', label: 'Password',      type: 'password', placeholder: '••••••••'        },
            ].map((f) => (
              <div key={f.name} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>{f.label}</label>
                <input
                  name={f.name} type={f.type} required placeholder={f.placeholder}
                  value={form[f.name]} onChange={handleChange}
                  style={{ width: '100%', border: '1.5px solid #e2e2f0', borderRadius: 10, padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: '#1a1a2e' }}
                  onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
                  onBlur={(e)  => (e.target.style.borderColor = '#e2e2f0')}
                />
              </div>
            ))}

            <div style={{ textAlign: 'right', marginBottom: 20 }}>
              <span style={{ fontSize: 12, color: '#4f46e5', fontWeight: 600, cursor: 'pointer' }}>Forgot password?</span>
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