import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import useBreakpoint from '../../hooks/useBreakpoint'

const categories = [
  { icon: 'fi fi-rr-code-simple', label: 'Programming', count: 312 },
  { icon: 'fi fi-rr-web-design', label: 'Design', count: 187 },
  { icon: 'fi fi-rr-drawer-alt', label: 'Writing', count: 143 },
  { icon: 'fi fi-rr-database', label: 'Data & Excel', count: 98 },
  { icon: 'fi fi-rr-mobile', label: 'Mobile App', count: 75 },
  { icon: 'fi fi-rr-customer-care', label: 'Home Services', count: 62 },
  { icon: 'fi fi-rr-sparkles', label: 'Creative Work', count: 45 },
  { icon: 'fi fi-rr-wrench-simple', label: 'Maintenance', count: 38 },
  { icon: 'fi fi-rr-leaf', label: 'Agriculture', count: 27 },
  { icon: 'fi fi-rr-shield', label: 'Security', count: 42 },
  { icon: 'fi fi-rr-microchip-ai', label: 'AI / ML', count: 61 },
  { icon: 'fi fi-rr-video-camera', label: 'Video / Media', count: 33 },
]

const steps = [
  { step: '01', title: 'Post your problem', desc: 'Describe your problem, set a budget and deadline in under 2 minutes.' },
  { step: '02', title: 'Receive proposals', desc: 'Expert solvers review your problem and send competitive proposals.' },
  { step: '03', title: 'Pick the best solver', desc: 'Review profiles, ratings and proposals. Choose who you trust.' },
  { step: '04', title: 'Get it done & pay', desc: 'Work is escrow-protected. Pay only when you are satisfied.' },
]

const testimonials = [
  { name: 'Arif Khan', role: 'Client', avatar: 'AK', text: 'Got my React bug fixed in 2 hours. The solver was professional and fast. Will use again!', rating: 5 },
  { name: 'Tasnim Ahmed', role: 'Solver', avatar: 'TA', text: 'SolveIt helped me earn ৳40,000 last month solving programming problems part-time.', rating: 5 },
  { name: 'Rafiq Mia', role: 'Client', avatar: 'RM', text: 'Finally a platform where I can find reliable freelancers with escrow payment protection.', rating: 4 },
]

export default function Home() {
  const { isMobile, isTablet, isSmall } = useBreakpoint()

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--bg-primary)', color: 'var(--text-primary)', overflowX: 'hidden' }}>
      <Navbar />

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: isSmall ? '60px 20px 40px' : '80px 24px 60px', maxWidth: 760, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-accent)', color: 'var(--text-brand)', border: '1px solid var(--border-secondary)', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 600, marginBottom: 22 }}>
          Bangladesh's Problem Solving Marketplace
        </div>
        <h1 style={{
          fontSize: isMobile ? 36 : isTablet ? 44 : 52,
          fontWeight: 800,
          lineHeight: 1.12,
          color: 'var(--text-primary)',
          letterSpacing: '-1px',
          marginBottom: 18
        }}>
          Post a Problem.<br />
          <span style={{ color: 'var(--text-brand)' }}>Get it Solved.</span>
        </h1>
        <p style={{ fontSize: isMobile ? 15 : 17, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Connect with expert solvers for programming, design, writing, and more. Fast, secure, and escrow-protected.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/problems" style={{ background: 'var(--text-brand)', color: '#fff', padding: '13px 30px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', flex: isMobile ? 1 : 'none' }}>
            Browse Problems
          </Link>
          <Link to="/register" style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1.5px solid var(--border-secondary)', padding: '13px 30px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none', flex: isMobile ? 1 : 'none' }}>
            Become a Solver
          </Link>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          marginTop: 48,
          background: 'var(--bg-card)',
          borderRadius: 16,
          border: '1px solid var(--border-primary)',
          overflow: 'hidden'
        }}>
          {[
            { n: '1,240+', l: 'Problems Solved' },
            { n: '840+', l: 'Active Solvers' },
            { n: '৳ 2.4M', l: 'Paid Out' },
            { n: '4.8 ★', l: 'Avg Rating' },
          ].map((s, i) => (
            <div key={i} style={{
              textAlign: 'center',
              padding: isMobile ? '16px' : '20px 24px',
              borderRight: (!isMobile && i < 3) || (isMobile && i % 2 === 0) ? '1px solid var(--border-primary)' : 'none',
              borderBottom: (isMobile && i < 2) ? '1px solid var(--border-primary)' : 'none'
            }}>
              <div style={{ fontSize: isMobile ? 20 : 26, fontWeight: 800, color: 'var(--text-brand)' }}>{s.n}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 500, marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '0 20px 60px' }}>
        <h2 style={{ fontSize: isSmall ? 24 : 28, fontWeight: 800, marginBottom: 24, textAlign: 'center', color: 'var(--text-primary)' }}>Browse by Category</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)',
          gap: 12
        }}>
          {categories.map((c, i) => (
            <Link to={`/problems?category=${c.label}`} key={i} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 14, padding: '20px 12px', textAlign: 'center', transition: 'all .2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-brand)'; e.currentTarget.style.background = 'var(--bg-hover)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.background = 'var(--bg-card)' }}
              >
                <div style={{ fontSize: 32, marginBottom: 12, color: 'var(--text-brand)' }}>
                  <i className={c.icon}></i>
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{c.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{c.count} open</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: 'var(--bg-secondary)', padding: '64px 20px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontSize: isSmall ? 24 : 28, fontWeight: 800, textAlign: 'center', marginBottom: 8, color: 'var(--text-primary)' }}>How SolveIt Works</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 15, marginBottom: 44 }}>Four simple steps to get your problem solved</p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: 20
          }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '28px 16px', background: 'var(--bg-primary)', borderRadius: 16, position: 'relative' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-brand)', letterSpacing: '.12em', marginBottom: 12 }}>{s.step}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>{s.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 960, margin: '0 auto', padding: '64px 20px' }}>
        <h2 style={{ fontSize: isSmall ? 24 : 28, fontWeight: 800, textAlign: 'center', marginBottom: 36, color: 'var(--text-primary)' }}>What People Say</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap: 16
        }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: 22 }}>
              <div style={{ fontSize: 16, color: '#f97316', marginBottom: 10 }}>{'★'.repeat(t.rating)}</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 16 }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--text-brand)' }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--text-brand)', padding: '64px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: isMobile ? 26 : 32, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Ready to get started?</h2>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,.8)', marginBottom: 30 }}>Join thousands of clients and solvers on SolveIt today.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{ background: '#fff', color: 'var(--text-brand)', padding: '13px 30px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', flex: isMobile ? 1 : 'none' }}>Post a Problem</Link>
          <Link to="/register" style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,.4)', padding: '13px 30px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none', flex: isMobile ? 1 : 'none' }}>Become a Solver</Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
