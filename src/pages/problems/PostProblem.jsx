import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { createProblem } from '../../api/problems.api'

const CATEGORIES = ['Programming', 'Design', 'Writing', 'Data & Excel', 'Mobile App', 'Security', 'AI / ML', 'Video / Media', 'Home Services', 'Creative Work', 'Maintenance', 'Agriculture', 'Other']

export default function PostProblem() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '', category: '', customCategory: '', description: '', budget: '', budgetType: 'fixed', deadline: '',
  })
  const [files, setFiles]     = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = new FormData()
      
      const payload = { ...form }
      if (payload.category === 'Other' && payload.customCategory) {
        payload.category = payload.customCategory
      }
      delete payload.customCategory

      Object.entries(payload).forEach(([k, v]) => data.append(k, v))
      files.forEach((f) => data.append('files', f))
      
      const res = await createProblem(data)
      navigate(`/problems/${res.data.problem._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post problem.')
    } finally { setLoading(false) }
  }

  const inputStyle = {
    width: '100%', border: '1.5px solid var(--input-border)', borderRadius: 10,
    padding: '10px 13px', fontSize: 14, fontFamily: 'inherit',
    outline: 'none', boxSizing: 'border-box', color: 'var(--text-primary)', background: 'var(--input-bg)',
  }
  const labelStyle = { fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Post a Problem</h1>
          <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Describe your problem clearly to attract the best solvers.</p>
        </div>

        {error && (
          <div style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error-text)', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 20, padding: 28 }}>
          {/* Title */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Problem title *</label>
            <input name="title" required placeholder="e.g. Build a REST API for my e-commerce app" value={form.title} onChange={handleChange} style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Category *</label>
            <select name="category" required value={form.category} onChange={handleChange} style={{ ...inputStyle, marginBottom: form.category === 'Other' ? 10 : 0 }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              <option value="Other">Other (Type below)</option>
            </select>
            
            {form.category === 'Other' && (
              <input name="customCategory" required placeholder="Type your custom category..." value={form.customCategory} onChange={handleChange} style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
                onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
              />
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Description *</label>
            <textarea name="description" required rows={7}
              placeholder="Describe your problem in detail. Include requirements, what you expect, tech stack preferences, etc."
              value={form.description} onChange={handleChange}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
            />
          </div>

          {/* Budget */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 18 }}>
            <div>
              <label style={labelStyle}>Budget (৳) *</label>
              <input name="budget" type="number" required min="1" placeholder="e.g. 3500" value={form.budget} onChange={handleChange} style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
                onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
              />
            </div>
            <div>
              <label style={labelStyle}>Budget type</label>
              <select name="budgetType" value={form.budgetType} onChange={handleChange} style={inputStyle}>
                <option value="fixed">Fixed price</option>
                <option value="range">Price range</option>
              </select>
            </div>
          </div>

          {/* Deadline */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Deadline *</label>
            <input name="deadline" type="date" required value={form.deadline} onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
            />
          </div>

          {/* File upload */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Attachments (optional)</label>
            <div style={{ border: '1.5px dashed var(--border-secondary)', borderRadius: 10, padding: '20px', textAlign: 'center', cursor: 'pointer', background: 'var(--bg-tertiary)' }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <div style={{ fontSize: 24, marginBottom: 6 }}>📎</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Click to attach files</div>
              <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 3 }}>Images, PDFs, code files — max 10MB each</div>
              <input id="file-input" type="file" multiple hidden onChange={(e) => setFiles(Array.from(e.target.files))} />
            </div>
            {files.length > 0 && (
              <div style={{ marginTop: 8 }}>
                {files.map((f, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: 'var(--tag-bg)', color: 'var(--tag-color)', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600, marginRight: 6, marginTop: 4 }}>
                    {f.name}
                    <span style={{ cursor: 'pointer', marginLeft: 2 }} onClick={() => setFiles(files.filter((_, j) => j !== i))}>×</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff',
            border: 'none', padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
          }}>
            {loading ? 'Posting...' : 'Post Problem →'}
          </button>
        </form>
      </div>
    </div>
  )
}