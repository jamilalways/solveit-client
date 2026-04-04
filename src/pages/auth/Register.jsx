import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const navigate = useNavigate()
  const [role, setRole] = useState('client')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      // Replace with real API call later:
      // const res = await api.post('/auth/register', { ...form, role })
      // localStorage.setItem('token', res.data.token)
      setTimeout(() => {
        setLoading(false)
        navigate('/login')
      }, 1000)
    } catch (err) {
      setLoading(false)
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fc', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      <div style={{ padding: '18px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link to="/" style={{ fontSize: 20, fontWeight: 800, color: '#4338ca', textDecoration: 'none' }}>
          Solve<span style={{ color: '#f97316' }}>It</span>
        </Link>
        <span style={{ fontSize: 13, color: '#888' }}>
          Have an account?{' '}
          <Link to="/login" style={{ color: '#4f46e5', fontWeight: 700, textDecoration: 'none' }}>Log in</Link>
        </span>
      </div>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 20, padding: '36px 32px', width: '100%', maxWidth: 440 }}>

          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 6 }}>Create account</h1>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>Choose how you want to use SolveIt</p>

          {/* Role selector */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { value: 'client', icon: '💼', label: 'I need problems solved', sub: 'Post as Client' },
              { value: 'solver', icon: '⚡', label: 'I want to solve problems', sub: 'Join as Solver' },
            ].map(r => (
              <div key={r.value} onClick={() => setRole(r.value)}
                style={{ border: `2px solid ${role === r.value ? '#4f46e5' : '#f0f0f8'}`, background: role === r.value ? '#eef2ff' : '#fff', borderRadius: 12, padding: '14px 10px', textAlign: 'center', cursor: 'pointer', transition: 'all .15s' }}>
                <div style={{ fontSize: 22, marginBottom: 5 }}>{r.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#333' }}>{r.label}</div>
                <div style={{ fontSize: 11, color: role === r.value ? '#4f46e5' : '#999', marginTop: 3, fontWeight: 600 }}>{r.sub}</div>
              </div>
            ))}
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 14 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {[
              { name: 'name', label: 'Full name', type: 'text', placeholder: 'Samin Reza' },
              { name: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Min. 8 characters' },
            ].map(f => (
              <div key={f.name} style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>{f.label}</label>
                <input
                  name={f.name} type={f.type} required
                  placeholder={f.placeholder}
                  value={form[f.name]} onChange={handleChange}
                  style={{ width: '100%', border: '1.5px solid #e2e2f0', borderRadius: 10, padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
                  onFocus={e => e.target.style.borderColor = '#6366f1'}
                  onBlur={e => e.target.style.borderColor = '#e2e2f0'}
                />
              </div>
            ))}

            <button type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff', border: 'none', padding: '13px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', marginTop: 4 }}>
              {loading ? 'Creating account...' : `Create ${role} account →`}
            </button>
          </form>

          <p style={{ fontSize: 11, color: '#bbb', textAlign: 'center', marginTop: 16, lineHeight: 1.6 }}>
            By signing up you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  )
}
