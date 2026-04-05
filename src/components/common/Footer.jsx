import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: '#1a1a2e', color: '#aaa',
      padding: '40px 32px 24px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: '#fff', marginBottom: 10 }}>
              Solve<span style={{ color: '#f97316' }}>It</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>Bangladesh's trusted problem solving marketplace.</p>
          </div>
          {[
            { title: 'Platform', links: [['Browse Problems','/problems'],['Post a Problem','/post-problem'],['How it works','/#how']] },
            { title: 'Account',  links: [['Login','/login'],['Register','/register'],['Dashboard','/']] },
            { title: 'Support',  links: [['Help Center','#'],['Contact Us','#'],['Report a Dispute','#']] },
          ].map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>{col.title}</div>
              {col.links.map(([label, to]) => (
                <div key={label} style={{ marginBottom: 8 }}>
                  <Link to={to} style={{ fontSize: 13, color: '#aaa', textDecoration: 'none' }}
                    onMouseEnter={e => e.target.style.color = '#fff'}
                    onMouseLeave={e => e.target.style.color = '#aaa'}
                  >{label}</Link>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 20, fontSize: 12, textAlign: 'center' }}>
          © 2025 SolveIt — Built as a Final Year CSE Project
        </div>
      </div>
    </footer>
  )
}