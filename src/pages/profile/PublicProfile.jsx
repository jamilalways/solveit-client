import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import ReviewCard from '../../components/common/ReviewCard'
import Badge from '../../components/common/Badge'
import Spinner from '../../components/common/Spinner'

const DEMO_PROFILE = {
  _id: 's1', name: 'Samin Reza', role: 'solver', badge: 'Pro',
  avgRating: 4.9, totalJobs: 28, totalEarned: 84000,
  skills: ['Node.js', 'React', 'MongoDB', 'Python', 'REST APIs', 'Docker'],
  bio: 'Full-stack developer with 4+ years of experience. Specialised in MERN stack and backend API development. I deliver clean, well-documented code on time.',
  reviews: [
    { _id: 'r1', reviewer: { name: 'Arif Khan' }, rating: 5, comment: 'Excellent work! Delivered the API ahead of schedule with full documentation. Highly recommended.', createdAt: new Date(Date.now() - 5 * 86400000) },
    { _id: 'r2', reviewer: { name: 'Tasnim Ahmed' }, rating: 5, comment: 'Very professional. Fixed all bugs and even improved performance.', createdAt: new Date(Date.now() - 12 * 86400000) },
    { _id: 'r3', reviewer: { name: 'Karim Uddin' }, rating: 4, comment: 'Good communication and clean code. Would hire again.', createdAt: new Date(Date.now() - 20 * 86400000) },
  ],
}

export default function PublicProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(DEMO_PROFILE)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch real profile when backend is ready
    // api.get(`/users/${id}`).then(res => setProfile(res.data.user)).catch(() => {})
  }, [id])

  if (loading) return <><Navbar /><Spinner /></>

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8f9fc', minHeight: '100vh' }}>
      <Navbar />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>
        {/* LEFT — profile card */}
        <div>
          <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 16, padding: 24, marginBottom: 14 }}>
            {/* Avatar */}
            <div style={{ width: 72, height: 72, borderRadius: 18, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: '#4f46e5', margin: '0 auto 12px' }}>
              {profile.name.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#1a1a2e' }}>{profile.name}</div>
              <div style={{ fontSize: 12, color: '#888', margin: '4px 0 10px' }}>Expert Solver</div>
              <Badge level={profile.badge} />
            </div>

            <div style={{ borderTop: '1px solid #f5f5f8', marginTop: 16, paddingTop: 16 }}>
              {[
                { label: 'Rating',    value: `${profile.avgRating} ★` },
                { label: 'Jobs done', value: profile.totalJobs          },
                { label: 'Earned',    value: `৳ ${profile.totalEarned.toLocaleString()}` },
              ].map((row) => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #f5f5f8', fontSize: 13 }}>
                  <span style={{ color: '#999' }}>{row.label}</span>
                  <span style={{ fontWeight: 700, color: '#1a1a2e' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Skills</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {profile.skills.map((s) => (
                <span key={s} style={{ background: '#f0f0ff', color: '#4f46e5', borderRadius: 7, padding: '4px 11px', fontSize: 12, fontWeight: 600 }}>{s}</span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div>
          {/* Bio */}
          <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 16, padding: 24, marginBottom: 16 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e', marginBottom: 10 }}>About</div>
            <p style={{ fontSize: 14, color: '#555', lineHeight: 1.8 }}>{profile.bio}</p>
          </div>

          {/* Reviews */}
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e', marginBottom: 14 }}>
              Reviews ({profile.reviews.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {profile.reviews.map((r) => <ReviewCard key={r._id} review={r} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}