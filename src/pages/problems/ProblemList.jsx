import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import ProblemCard from '../../components/common/ProblemCard'
import Spinner from '../../components/common/Spinner'
import { getProblems } from '../../api/problems.api'
import { useDebounce } from '../../hooks/useDebounce'

const CATEGORIES = ['All', 'Programming', 'Design', 'Writing', 'Data & Excel', 'Mobile App', 'Security', 'AI / ML', 'Video / Media']
const BUDGETS    = [{ label: 'Any budget', value: '' }, { label: 'Under ৳500', value: '0-500' }, { label: '৳500 – ৳2,000', value: '500-2000' }, { label: '৳2,000 – ৳5,000', value: '2000-5000' }, { label: 'Above ৳5,000', value: '5000+' }]
const SORTS      = [{ label: 'Newest first', value: 'newest' }, { label: 'Budget: High to Low', value: 'budget_desc' }, { label: 'Deadline: Soonest', value: 'deadline_asc' }, { label: 'Most bids', value: 'bids_desc' }]

// Demo data shown when backend is not connected
const DEMO_PROBLEMS = [
  { _id: '1', title: 'Build a REST API for e-commerce app with Node.js', category: 'Programming', description: 'Need endpoints for products, cart, orders and payments. MongoDB preferred. Should include JWT auth and role-based access control.', budget: 3500, deadline: new Date(Date.now() + 3 * 86400000), bidsCount: 7 },
  { _id: '2', title: 'Design a modern logo and brand kit for a fintech startup', category: 'Design', description: 'Tech startup in fintech space. Need logo, colors, typography guide. Deliverables: AI, PNG and PDF files.', budget: 2000, deadline: new Date(Date.now() + 5 * 86400000), bidsCount: 4 },
  { _id: '3', title: 'Automate monthly sales report with Excel macros (VBA)', category: 'Data & Excel', description: 'Currently doing it manually. Need VBA macro that pulls from 3 sheets and creates pivot summary automatically.', budget: 800, deadline: new Date(Date.now() + 7 * 86400000), bidsCount: 2 },
  { _id: '4', title: 'Write 5 SEO-optimised blog articles about digital marketing', category: 'Writing', description: 'Each article 800–1000 words. Topics provided. Need keyword research included. Bangla or English.', budget: 1200, deadline: new Date(Date.now() + 10 * 86400000), bidsCount: 11 },
  { _id: '5', title: 'Fix login bug and deploy React app to Vercel', category: 'Programming', description: 'App builds locally but fails on Vercel. Authentication state is lost on refresh. Need urgent fix.', budget: 600, deadline: new Date(Date.now() + 1 * 86400000), bidsCount: 9 },
  { _id: '6', title: 'Create a mobile UI design for food delivery app', category: 'Mobile App', description: 'Figma design needed. 8–10 screens. Modern, clean look. Reference apps: Pathao Food, Shohoz.', budget: 2800, deadline: new Date(Date.now() + 8 * 86400000), bidsCount: 5 },
]

export default function ProblemList() {
  const [problems, setProblems]   = useState(DEMO_PROBLEMS)
  const [loading, setLoading]     = useState(false)
  const [search, setSearch]       = useState('')
  const [category, setCategory]   = useState('All')
  const [budget, setBudget]       = useState('')
  const [sort, setSort]           = useState('newest')
  const debouncedSearch           = useDebounce(search, 400)

  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true)
      try {
        const res = await getProblems({ search: debouncedSearch, category: category === 'All' ? '' : category, budget, sort })
        setProblems(res.data.problems)
      } catch {
        // Backend not connected — keep demo data
      } finally {
        setLoading(false)
      }
    }
    fetchProblems()
  }, [debouncedSearch, category, budget, sort])

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8f9fc', minHeight: '100vh' }}>
      <Navbar />

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #f0f0f5', padding: '28px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a1a2e', marginBottom: 4 }}>Open Problems</h1>
              <p style={{ fontSize: 13, color: '#888' }}>{problems.length} problems available</p>
            </div>
            <Link to="/post-problem" style={{ background: '#4f46e5', color: '#fff', padding: '10px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
              + Post a Problem
            </Link>
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', marginTop: 16 }}>
            <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16 }}>🔍</span>
            <input
              type="text" placeholder="Search problems by title, keyword..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', border: '1.5px solid #e2e2f0', borderRadius: 12, padding: '11px 14px 11px 42px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
              onBlur={(e)  => (e.target.style.borderColor = '#e2e2f0')}
            />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 32px', display: 'flex', gap: 24 }}>
        {/* Sidebar filters */}
        <aside style={{ width: 200, flexShrink: 0 }}>
          <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 14, padding: 18, marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Category</div>
            {CATEGORIES.map((c) => (
              <div key={c} onClick={() => setCategory(c)} style={{
                fontSize: 13, fontWeight: 600, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2,
                color: category === c ? '#4f46e5' : '#555',
                background: category === c ? '#eef2ff' : 'transparent',
              }}>{c}</div>
            ))}
          </div>
          <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: 14, padding: 18, marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Budget</div>
            {BUDGETS.map((b) => (
              <div key={b.value} onClick={() => setBudget(b.value)} style={{
                fontSize: 13, fontWeight: 600, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2,
                color: budget === b.value ? '#4f46e5' : '#555',
                background: budget === b.value ? '#eef2ff' : 'transparent',
              }}>{b.label}</div>
            ))}
          </div>
        </aside>

        {/* Problems grid */}
        <div style={{ flex: 1 }}>
          {/* Sort bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: '#888' }}>Showing {problems.length} results</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ border: '1.5px solid #e2e2f0', borderRadius: 10, padding: '7px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: '#444' }}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {loading ? (
            <Spinner />
          ) : problems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: '#aaa' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>No problems found</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Try adjusting your filters</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
              {problems.map((p) => <ProblemCard key={p._id} problem={p} />)}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}