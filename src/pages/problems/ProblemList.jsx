import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import ProblemCard from '../../components/common/ProblemCard'
import Spinner from '../../components/common/Spinner'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { getProblems } from '../../api/problems.api'
import { useAuth } from '../../context/AuthContext'
import useBreakpoint from '../../hooks/useBreakpoint'
import { useDebounce } from '../../hooks/useDebounce'

const CATEGORIES = ['All', 'Programming', 'Design', 'Writing', 'Data & Excel', 'Mobile App', 'Security', 'AI / ML', 'Video / Media', 'Home Services', 'Creative Work', 'Maintenance', 'Agriculture', 'Other']
const BUDGETS    = [{ label: 'Any budget', value: '' }, { label: 'Under ৳500', value: '0-500' }, { label: '৳500 – ৳2,000', value: '500-2000' }, { label: '৳2,000 – ৳5,000', value: '2000-5000' }, { label: 'Above ৳5,000', value: '5000+' }]
const SORTS      = [{ label: 'Newest first', value: 'newest' }, { label: 'Budget: High to Low', value: 'budget_desc' }, { label: 'Deadline: Soonest', value: 'deadline_asc' }, { label: 'Most bids', value: 'bids_desc' }]

export default function ProblemList() {
  const { user } = useAuth()
  const { isSmall, isMobile } = useBreakpoint()
  const [problems, setProblems]   = useState([])
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
        // failed
      } finally {
        setLoading(false)
      }
    }
    fetchProblems()
  }, [debouncedSearch, category, budget, sort])

  const content = (
    <div style={{ flex: 1 }}>
      {/* Header */}
      <div style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-primary)', padding: isMobile ? '20px' : '28px 32px', borderRadius: user ? 16 : 0, marginBottom: user ? 24 : 0 }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>Open Problems</h1>
              <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{problems.length} problems available</p>
            </div>
            {user?.role === 'client' && (
              <Link to="/post-problem" style={{ background: 'var(--color-primary-600)', color: '#fff', padding: '10px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
                + Post a Problem
              </Link>
            )}
          </div>

          {/* Search bar */}
          <div style={{ position: 'relative', marginTop: 16 }}>
            <i className="fi fi-rr-search" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--text-muted)' }}></i>
            <input
              type="text" placeholder="Search problems by title, keyword..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', border: '1.5px solid var(--input-border)', borderRadius: 12, padding: '11px 14px 11px 42px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
              onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
            />
          </div>
        </div>
      </div>

      <div style={{ 
        maxWidth: 1100, 
        margin: '0 auto', 
        padding: isMobile ? '16px' : (user ? '0' : '24px 32px'), 
        display: 'flex', 
        flexDirection: isSmall ? 'column' : 'row',
        gap: 24 
      }}>
        {/* Sidebar filters */}
        <aside style={{ width: isSmall ? '100%' : 200, flexShrink: 0 }}>
          {isSmall ? (
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10, marginBottom: 10, scrollbarWidth: 'none' }}>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ padding: '8px 12px', borderRadius: 10, border: '1.5px solid var(--border-primary)', background: 'var(--bg-card)', fontSize: 13, color: 'var(--text-primary)' }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select value={budget} onChange={(e) => setBudget(e.target.value)} style={{ padding: '8px 12px', borderRadius: 10, border: '1.5px solid var(--border-primary)', background: 'var(--bg-card)', fontSize: 13, color: 'var(--text-primary)' }}>
                {BUDGETS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
            </div>
          ) : (
            <>
              <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 14, padding: 18, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Category</div>
                {CATEGORIES.map((c) => (
                  <div key={c} onClick={() => setCategory(c)} style={{
                    fontSize: 13, fontWeight: 600, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2,
                    color: category === c ? 'var(--text-brand)' : 'var(--text-secondary)',
                    background: category === c ? 'var(--bg-accent)' : 'transparent',
                  }}>{c}</div>
                ))}
              </div>
              <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 14, padding: 18, marginBottom: 12 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Budget</div>
                {BUDGETS.map((b) => (
                  <div key={b.value} onClick={() => setBudget(b.value)} style={{
                    fontSize: 13, fontWeight: 600, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 2,
                    color: budget === b.value ? 'var(--text-brand)' : 'var(--text-secondary)',
                    background: budget === b.value ? 'var(--bg-accent)' : 'transparent',
                  }}>{b.label}</div>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* Problems grid */}
        <div style={{ flex: 1 }}>
          {/* Sort bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>Showing {problems.length} results</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ border: '1.5px solid var(--border-primary)', borderRadius: 10, padding: '7px 12px', fontSize: 13, fontFamily: 'inherit', outline: 'none', color: 'var(--text-primary)', background: 'var(--bg-card)' }}>
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>

          {loading ? (
            <Spinner />
          ) : problems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 40, marginBottom: 12, color: 'var(--text-muted)' }}><i className="fi fi-rr-search"></i></div>
              <div style={{ fontSize: 16, fontWeight: 700 }}>No problems found</div>
              <div style={{ fontSize: 13, marginTop: 6 }}>Try adjusting your filters</div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: 14 }}>
              {problems.map((p) => <ProblemCard key={p._id} problem={p} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  if (user) {
    return (
      <DashboardLayout>
        {content}
      </DashboardLayout>
    )
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <Navbar />
      {content}
      <Footer />
    </div>
  )
}