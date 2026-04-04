import { Link } from 'react-router-dom'

const categories = [
  { icon: '💻', label: 'Programming', count: 312 },
  { icon: '🎨', label: 'Design', count: 187 },
  { icon: '✍️', label: 'Writing', count: 143 },
  { icon: '📊', label: 'Data & Excel', count: 98 },
  { icon: '📱', label: 'Mobile App', count: 75 },
  { icon: '🔒', label: 'Security', count: 42 },
  { icon: '🤖', label: 'AI / ML', count: 61 },
  { icon: '📹', label: 'Video / Media', count: 33 },
]

const steps = [
  { step: '01', title: 'Post your problem', desc: 'Describe your problem, set a budget and deadline. Takes less than 2 minutes.' },
  { step: '02', title: 'Receive proposals', desc: 'Expert solvers review your problem and send competitive proposals.' },
  { step: '03', title: 'Pick the best solver', desc: 'Review profiles, ratings and proposals. Choose who you trust.' },
  { step: '04', title: 'Get it done & pay', desc: 'Work is protected by escrow. Pay only when you are satisfied.' },
]

const testimonials = [
  { name: 'Arif Khan', role: 'Client', avatar: 'AK', text: 'Got my React bug fixed in 2 hours. The solver was professional and fast. Will use again!', rating: 5 },
  { name: 'Tasnim Ahmed', role: 'Solver', avatar: 'TA', text: 'SolveIt helped me earn ৳40,000 last month solving programming problems part-time.', rating: 5 },
  { name: 'Rafiq Mia', role: 'Client', avatar: 'RM', text: 'Finally a platform where I can find reliable freelancers with escrow protection.', rating: 4 },
]

export default function Home() {
  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8f9fc', color: '#1a1a2e' }}>

      {/* NAVBAR */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #f0f0f5', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#4338ca', letterSpacing: '-0.5px' }}>
          Solve<span style={{ color: '#f97316' }}>It</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Link to="/problems" style={{ fontSize: 14, fontWeight: 500, color: '#555', padding: '6px 14px', borderRadius: 10, textDecoration: 'none' }}>Browse Problems</Link>
          <a href="#how" style={{ fontSize: 14, fontWeight: 500, color: '#555', padding: '6px 14px', borderRadius: 10, textDecoration: 'none' }}>How it works</a>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/login" style={{ border: '1.5px solid #e2e2f0', background: '#fff', color: '#333', padding: '8px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
          <Link to="/register" style={{ background: '#4f46e5', color: '#fff', padding: '8px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Get started</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: 720, margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#eef2ff', color: '#4338ca', border: '1px solid #c7d2fe', borderRadius: 100, padding: '5px 16px', fontSize: 12, fontWeight: 600, marginBottom: 22 }}>
          🚀 Bangladesh's Problem Solving Marketplace
        </div>
        <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.12, color: '#1a1a2e', letterSpacing: '-1px', marginBottom: 18 }}>
          Post a Problem.<br />
          <span style={{ color: '#4f46e5' }}>Get it Solved.</span>
        </h1>
        <p style={{ fontSize: 17, color: '#666', maxWidth: 480, margin: '0 auto 32px', lineHeight: 1.7 }}>
          Connect with expert solvers for programming, design, writing, and more. Fast, secure, and escrow-protected payments.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/problems" style={{ background: '#4f46e5', color: '#fff', padding: '13px 30px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Browse Problems →
          </Link>
          <Link to="/register" style={{ background: '#fff', color: '#333', border: '1.5px solid #e2e2ee', padding: '13px 30px', borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
            Become a Solver
          </Link>
        </div>

        {/* STATS */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginTop: 48, background: '#fff', borderRadius: 16, border: '1px solid #f0f0f5', padding: '20px 0', flexWrap: 'wrap' }}>
          {[
            { n: '1,240+', l: 'Problems Solved' },
            { n: '840+', l: 'Active Solvers' },
            { n: '৳ 2.4M', l: 'Paid Out' },
            { n: '4.8 ★', l: 'Avg Rating' },
          ].map((s, i) => (
            <div key={i} style={{ textAlign: 'center', padding: '0 36px', borderRight: i < 3 ? '1px solid #f0f0f5' : 'none' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: '#4f46e5' }}>{s.n}</div>
              <div style={{ fontSize: 12, color: '#888', fontWeight: 500, marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 60px' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 20, textAlign: 'center' }}>Browse by Category</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {categories.map((c, i) => (
            <Link to={`/problems?category=${c.label}`} key={i}
              style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 14, padding: '20px 12px', textAlign: 'center', textDecoration: 'none', transition: 'all .2s', cursor: 'pointer' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.background = '#fafafe' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f8'; e.currentTarget.style.background = '#fff' }}
            >
              <div style={{ fontSize: 26, marginBottom: 8 }}>{c.icon}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e' }}>{c.label}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 3 }}>{c.count} open</div>
            </Link>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ background: '#fff', padding: '60px 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>How SolveIt Works</h2>
          <p style={{ textAlign: 'center', color: '#888', fontSize: 15, marginBottom: 40 }}>Four simple steps to get your problem solved</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '24px 16px', background: '#f8f9fc', borderRadius: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#4f46e5', letterSpacing: '.1em', marginBottom: 10 }}>{s.step}</div>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#777', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ fontSize: 26, fontWeight: 800, textAlign: 'center', marginBottom: 32 }}>What People Say</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {testimonials.map((t, i) => (
            <div key={i} style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 16, padding: 20 }}>
              <div style={{ fontSize: 14, color: '#f97316', marginBottom: 10 }}>{'★'.repeat(t.rating)}</div>
              <p style={{ fontSize: 13, color: '#555', lineHeight: 1.7, marginBottom: 14 }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#4f46e5' }}>{t.avatar}</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#888' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ background: '#4f46e5', padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, color: '#fff', marginBottom: 12 }}>Ready to get started?</h2>
        <p style={{ fontSize: 15, color: '#c7d2fe', marginBottom: 28 }}>Join thousands of clients and solvers on SolveIt today.</p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{ background: '#fff', color: '#4f46e5', padding: '13px 30px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Post a Problem
          </Link>
          <Link to="/register" style={{ background: 'transparent', color: '#fff', border: '1.5px solid rgba(255,255,255,.4)', padding: '13px 30px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>
            Become a Solver
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: '#1a1a2e', color: '#aaa', textAlign: 'center', padding: '28px 24px', fontSize: 13 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
          Solve<span style={{ color: '#f97316' }}>It</span>
        </div>
        <div>© 2025 SolveIt. Built as a final year CSE project.</div>
      </footer>

    </div>
  )
}
