import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../api/users.api'

export default function EditProfile() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const fileRef = useRef(null)

  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
  })
  const [avatarFile, setAvatarFile]   = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [message, setMessage]   = useState('')
  const [error, setError]       = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const data = new FormData()
      data.append('name', form.name)
      data.append('bio', form.bio)
      // Send skills as JSON array
      const skillsArray = form.skills.split(',').map((s) => s.trim()).filter(Boolean)
      data.append('skills', JSON.stringify(skillsArray))
      if (avatarFile) data.append('avatar', avatarFile)

      const res = await updateProfile(data)
      setUser(res.data.user)
      setMessage('Profile updated successfully!')
      setTimeout(() => navigate(-1), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'
  const currentAvatar = avatarPreview || (user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `${apiBase}${user.avatar}`) : null)

  const inputStyle = {
    width: '100%', border: '1.5px solid var(--input-border)', borderRadius: 10,
    padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', color: 'var(--text-primary)', background: 'var(--input-bg)',
  }
  const labelStyle = { fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 600 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Edit Profile</h1>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Update your personal information and profile image.</p>

        {message && (
          <div style={{ background: 'var(--status-done-bg)', color: 'var(--status-done-color)', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16, fontWeight: 600 }}>
            ✓ {message}
          </div>
        )}
        {error && (
          <div style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error-text)', borderRadius: 10, padding: '10px 14px', fontSize: 13, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 20, padding: 28 }}>
          {/* Avatar Upload */}
          <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                width: 80, height: 80, borderRadius: 20, overflow: 'hidden',
                background: 'var(--bg-accent)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', border: '2px dashed var(--border-secondary)',
                flexShrink: 0, position: 'relative',
              }}
            >
              {currentAvatar ? (
                <img src={currentAvatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-brand)' }}>
                  {user?.name?.slice(0, 2).toUpperCase()}
                </span>
              )}
              <div style={{
                position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0, transition: 'opacity 0.2s',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = 1)}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = 0)}
              >
                <span style={{ color: '#fff', fontSize: 20 }}>📷</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Profile Photo</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Click to upload · JPG, PNG, WebP · Max 5MB</div>
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
            </div>
          </div>

          {/* Name */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Full Name</label>
            <input name="name" required value={form.name} onChange={handleChange} style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
            />
          </div>

          {/* Bio */}
          <div style={{ marginBottom: 18 }}>
            <label style={labelStyle}>Bio</label>
            <textarea name="bio" rows={4} maxLength={500} placeholder="Tell us about yourself..."
              value={form.bio} onChange={handleChange}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
            />
            <div style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'right', marginTop: 4 }}>{form.bio.length}/500</div>
          </div>

          {/* Skills */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Skills (comma-separated)</label>
            <input name="skills" placeholder="e.g. React, Node.js, MongoDB" value={form.skills} onChange={handleChange}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
            />
            {form.skills && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
                {form.skills.split(',').map((s) => s.trim()).filter(Boolean).map((s) => (
                  <span key={s} style={{ background: 'var(--tag-bg)', color: 'var(--tag-color)', borderRadius: 7, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}
            style={{
              width: '100%', background: loading ? '#a5b4fc' : '#4f46e5', color: '#fff',
              border: 'none', padding: 14, borderRadius: 12, fontSize: 15, fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}>
            {loading ? 'Saving...' : 'Save Changes →'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}