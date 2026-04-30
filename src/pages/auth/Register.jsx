import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [role, setRole]       = useState('client')
  const [form, setForm]       = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      const user = await register(form.name, form.email, form.password, role)
      if (user.role === 'client') navigate('/dashboard/client')
      else navigate('/dashboard/solver')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
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
          Have an account?{' '}
          <Link to="/login" style={{ color: 'var(--text-brand)', fontWeight: 700, textDecoration: 'none' }}>Log in</Link>
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 440 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 6 }}>Create account</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 22 }}>Choose how you want to use SolveIt</p>

          {/* Role selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { value: 'client', label: 'I need problems solved', sub: 'Post as Client' },
              { value: 'solver', label: 'I want to solve problems', sub: 'Join as Solver' },
            ].map((r) => (
              <div key={r.value} onClick={() => setRole(r.value)} style={{
                border: `2px solid ${role === r.value ? 'var(--text-brand)' : 'var(--border-primary)'}`,
                background: role === r.value ? 'var(--bg-accent)' : 'var(--bg-card)',
                borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s',
              }}>
                <div style={{ fontSize: 24, marginBottom: 5 }}>{r.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{r.label}</div>
                <div style={{ fontSize: 11, color: role === r.value ? 'var(--text-brand)' : 'var(--text-muted)', marginTop: 3, fontWeight: 600 }}>{r.sub}</div>
              </div>
            ))}
          </div>

          {error && (
            <div style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error-text)', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 5 }}>Full name</label>
              <input
                name="name" type="text" required placeholder="Samin Reza"
                value={form.name} onChange={handleChange}
                style={{ width: '100%', border: '1.5px solid var(--input-border)', borderRadius: 10, padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', color: 'var(--text-primary)', background: 'var(--input-bg)' }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
                onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
              />
            </div>
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
                  name="password" type={showPassword ? 'text' : 'password'} required placeholder="Min. 8 characters"
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

            <button type="submit" disabled={loading} style={{
              width: '100%', background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff',
              border: 'none', padding: 13, borderRadius: 12, fontSize: 14, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 4,
            }}>
              {loading ? 'Creating account...' : `Create ${role} account →`}
            </button>
          </form>
          <p style={{ fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 16 }}>
            By signing up you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}