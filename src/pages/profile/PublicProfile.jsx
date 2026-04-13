import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import ReviewCard from '../../components/common/ReviewCard'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'
import { useAuth } from '../../context/AuthContext'
import { getProfile } from '../../api/users.api'
import { startConversation } from '../../api/dm.api'

export default function PublicProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [msgLoading, setMsgLoading] = useState(false)

  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'
  const avatarUrl = profile?.avatar ? (profile.avatar.startsWith('http') ? profile.avatar : `${apiBase}${profile.avatar}`) : null

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true)
      try {
        const res = await getProfile(id)
        setProfile(res.data.user)
        setReviews(res.data.reviews || [])
      } catch {
        // fallback
      }
      setLoading(false)
    }
    fetchProfile()
  }, [id])

  const handleSendMessage = async () => {
    if (!currentUser) return navigate('/login')
    setMsgLoading(true)
    try {
      const res = await startConversation(id)
      navigate(`/messages/${res.data.conversation._id}`)
    } catch {
      // failed
    }
    setMsgLoading(false)
  }

  if (loading) return <><Navbar /><Spinner /></>
  if (!profile) return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>User not found.</div>
    </div>
  )

  const isOwnProfile = currentUser?._id === profile._id

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
        {/* LEFT — profile card */}
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: 24, marginBottom: 14 }}>
            {/* Avatar */}
            <div style={{
              width: 72, height: 72, borderRadius: 18, overflow: 'hidden',
              background: 'var(--bg-accent)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: 22, fontWeight: 800,
              color: 'var(--text-brand)', margin: '0 auto 12px',
            }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                profile.name.slice(0, 2).toUpperCase()
              )}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)' }}>{profile.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', margin: '4px 0 10px', textTransform: 'capitalize' }}>{profile.role}</div>
              <Badge level={profile.badge} />
            </div>

            <div style={{ borderTop: '1px solid var(--border-light)', marginTop: 16, paddingTop: 16 }}>
              {[
                { label: 'Rating',    value: `${profile.avgRating || 0} ★` },
                { label: 'Jobs done', value: profile.totalJobs || 0 },
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid var(--border-light)', fontSize: 13 }}>
                  <span style={{ color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{row.value}</span>
                </div>
              ))}
            </div>

            {/* Send Message button */}
            {currentUser && !isOwnProfile && (
              <button onClick={handleSendMessage} disabled={msgLoading}
                style={{
                  width: '100%', marginTop: 16,
                  background: '#4f46e5', color: '#fff', border: 'none',
                  padding: '10px 18px', borderRadius: 10, fontSize: 13,
                  fontWeight: 700, cursor: msgLoading ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', transition: 'all .15s',
                }}
                onMouseEnter={(e) => (e.target.style.background = '#4338ca')}
                onMouseLeave={(e) => (e.target.style.background = '#4f46e5')}
              >
                {msgLoading ? 'Opening...' : '💬 Send Message'}
              </button>
            )}

            {isOwnProfile && (
              <button onClick={() => navigate('/profile/edit')}
                style={{
                  width: '100%', marginTop: 16,
                  background: 'var(--bg-tertiary)', color: 'var(--text-secondary)',
                  border: '1px solid var(--border-secondary)',
                  padding: '10px 18px', borderRadius: 10, fontSize: 13,
                  fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {/* Skills */}
          {profile.skills?.length > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Skills</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                {profile.skills.map((s) => (
                  <span key={s} style={{ background: 'var(--tag-bg)', color: 'var(--tag-color)', borderRadius: 7, padding: '4px 11px', fontSize: 12, fontWeight: 600 }}>{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div>
          {/* Bio */}
          {profile.bio && (
            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: 24, marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10 }}>About</div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{profile.bio}</p>
            </div>
          )}

          {/* Reviews */}
          {reviews.length > 0 && (
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 14 }}>
                Reviews ({reviews.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
              </div>
            </div>
          )}

          {reviews.length === 0 && !profile.bio && (
            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: 40, textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📝</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>No details yet</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}