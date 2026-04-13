import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import BidCard from '../../components/common/BidCard'
import Spinner from '../../components/common/Spinner'
import Modal from '../../components/common/Modal'
import { useAuth } from '../../context/AuthContext'
import { getProblem } from '../../api/problems.api'
import { submitBid, acceptBid, rejectBid } from '../../api/bids.api'
import { formatBDT } from '../../utils/formatCurrency'
import { formatDate, daysLeft } from '../../utils/formatDate'

// Demo data
const DEMO = {
  _id: '1', title: 'Build a REST API for e-commerce app with Node.js',
  category: 'Programming', status: 'open',
  description: `I need a complete REST API built with Node.js and Express for my e-commerce application.\n\nRequired endpoints:\n- User authentication (register, login, JWT)\n- Product CRUD with image upload\n- Shopping cart management\n- Order processing\n- Payment integration (SSLCommerz)\n\nThe API should follow REST best practices, include proper error handling, and have Swagger documentation.`,
  budget: 3500, budgetType: 'fixed',
  deadline: new Date(Date.now() + 3 * 86400000),
  files: [], bidsCount: 7, createdAt: new Date(Date.now() - 2 * 86400000),
  client: { _id: 'c1', name: 'Arif Khan', avgRating: 4.8 },
  bids: [
    { _id: 'b1', solver: { name: 'Samin Reza', avgRating: 4.9 }, proposedPrice: 3200, deliveryDays: 5, message: 'I have 4 years of Node.js experience and have built 20+ APIs. I can deliver this with full Swagger docs and unit tests.', status: 'pending', createdAt: new Date(Date.now() - 86400000) },
    { _id: 'b2', solver: { name: 'Rafiq Dev',  avgRating: 4.5 }, proposedPrice: 3500, deliveryDays: 7, message: 'Expert in MERN stack. Will include Postman collection and deployment to Railway.', status: 'pending', createdAt: new Date(Date.now() - 43200000) },
  ],
}

export default function ProblemDetail() {
  const { id }   = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [problem, setProblem]   = useState(DEMO)
  const [loading, setLoading]   = useState(false)
  const [bidModal, setBidModal] = useState(false)
  const [bidForm, setBidForm]   = useState({ proposedPrice: '', deliveryDays: '', message: '' })
  const [bidLoading, setBidLoading] = useState(false)

  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await getProblem(id)
        // Ensure bids are correctly placed on problem object
        setProblem({ ...res.data.problem, bids: res.data.bids })
      } catch { /* use demo */ }
      finally { setLoading(false) }
    }
    fetch()
  }, [id])

  const handleSubmitBid = async (e) => {
    e.preventDefault()
    setBidLoading(true)
    try {
      await submitBid(id, bidForm)
      setBidModal(false)
      setBidForm({ proposedPrice: '', deliveryDays: '', message: '' })
      // Re-fetch bids after submission
      const res = await getProblem(id)
      setProblem({ ...res.data.problem, bids: res.data.bids })
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit bid.')
    } finally { setBidLoading(false) }
  }

  const handleAccept = async (bidId) => {
    try {
      await acceptBid(bidId)
      navigate('/dashboard/client')
    } catch (err) { alert(err.response?.data?.message || 'Failed to accept bid.') }
  }

  const handleReject = async (bidId) => {
    try {
      await rejectBid(bidId)
      setProblem((p) => ({ ...p, bids: p.bids.map((b) => b._id === bidId ? { ...b, status: 'rejected' } : b) }))
    } catch (err) { alert(err.response?.data?.message || 'Failed to reject bid.') }
  }

  if (loading) return <><Navbar /><Spinner /></>

  const isClient = user?.role === 'client'
  const isSolver = user?.role === 'solver'
  const isOwner  = user?._id === problem.client?._id
  const dl = daysLeft(problem.deadline)

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--bg-primary)', minHeight: '100vh', paddingBottom: 60 }}>
      <Navbar />

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '28px 24px', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        {/* LEFT */}
        <div>
          {/* Problem card */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: 28, marginBottom: 20 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: 10, fontWeight: 700, background: 'var(--bg-accent)', color: 'var(--text-brand)', padding: '3px 10px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '.04em' }}>
                {problem.category}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, background: problem.status === 'open' ? 'var(--status-done-bg)' : 'var(--error-bg)', color: problem.status === 'open' ? 'var(--status-done-color)' : 'var(--error-text)', padding: '3px 10px', borderRadius: 6 }}>
                {problem.status}
              </span>
            </div>

            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.3, marginBottom: 16 }}>{problem.title}</h1>

            <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-line', marginBottom: 20 }}>
              {problem.description}
            </div>

            {problem.files?.length > 0 && (
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>ATTACHMENTS</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {problem.files.map((f, i) => {
                    const isImage = f.url.match(/\.(jpeg|jpg|gif|png|webp)$/i)
                    const fileUrl = f.url.startsWith('http') ? f.url : `${apiBase}${f.url}`
                    return (
                      <div key={i}>
                        {isImage ? (
                          <div style={{ border: '1.5px solid var(--border-light)', padding: 8, borderRadius: 12, display: 'inline-block', background: 'var(--bg-tertiary)' }}>
                            <img src={fileUrl} alt={f.name} style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8, display: 'block' }} />
                            <a href={fileUrl} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--text-brand)', textDecoration: 'none', display: 'block', marginTop: 8, fontWeight: 600 }}>↗ View Original</a>
                          </div>
                        ) : (
                          <a href={fileUrl} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--bg-accent)', color: 'var(--text-brand)', padding: '8px 14px', borderRadius: 8, fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>
                            📎 {f.name}
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bids section */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>Proposals ({problem.bids?.length || 0})</h2>
              {isSolver && problem.status === 'open' && (
                <button onClick={() => setBidModal(true)} style={{ background: 'var(--color-primary-600)', color: '#fff', border: 'none', padding: '9px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Submit a Proposal
                </button>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(problem.bids || []).map((bid) => (
                <BidCard key={bid._id} bid={bid} isClient={isOwner} onAccept={handleAccept} onReject={handleReject} />
              ))}
              {(!problem.bids || problem.bids.length === 0) && (
                <div style={{ textAlign: 'center', padding: '40px 24px', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 14, border: '1.5px solid var(--border-primary)' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>No proposals yet</div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>Be the first to submit a proposal</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Budget & details */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-brand)', marginBottom: 4 }}>{formatBDT(problem.budget)}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 18 }}>Fixed price budget</div>
            {[
              { label: 'Deadline',  value: formatDate(problem.deadline) },
              { label: 'Time left', value: dl },
              { label: 'Posted',    value: formatDate(problem.createdAt) },
              { label: 'Proposals', value: `${problem.bids?.length || 0} received` },
            ].map((row) => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{row.value}</span>
              </div>
            ))}
            {isSolver && problem.status === 'open' && (
              <button onClick={() => setBidModal(true)} style={{ width: '100%', background: 'var(--color-primary-600)', color: '#fff', border: 'none', padding: '11px', borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', marginTop: 14 }}>
                Submit Proposal →
              </button>
            )}
          </div>

          {/* Client info */}
          <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>Posted by</div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {problem.client?.avatar ? (
                <img 
                  src={problem.client.avatar.startsWith('http') ? problem.client.avatar : `${apiBase}${problem.client.avatar}`} 
                  alt={problem.client.name} 
                  style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} 
                />
              ) : (
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--text-brand)' }}>
                  {problem.client?.name?.slice(0, 2).toUpperCase() || 'C'}
                </div>
              )}
              <div>
                <Link to={`/profile/${problem.client?._id}`} style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>{problem.client?.name}</Link>
                <div style={{ fontSize: 12, color: '#f97316' }}>★ {problem.client?.avgRating?.toFixed(1) || '0.0'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bid submit modal */}
      <Modal open={bidModal} onClose={() => setBidModal(false)} title="Submit a Proposal">
        <form onSubmit={handleSubmitBid}>
          {[
            { name: 'proposedPrice', label: 'Your price (৳)', type: 'number', placeholder: '2500' },
            { name: 'deliveryDays',  label: 'Delivery time (days)', type: 'number', placeholder: '5' },
          ].map((f) => (
            <div key={f.name} style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>{f.label}</label>
              <input
                name={f.name} type={f.type} required placeholder={f.placeholder}
                value={bidForm[f.name]} onChange={(e) => setBidForm({ ...bidForm, [e.target.name]: e.target.value })}
                style={{ width: '100%', border: '1.5px solid #e2e2f0', borderRadius: 10, padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          ))}
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: '#555', display: 'block', marginBottom: 5 }}>Your proposal message</label>
            <textarea
              required rows={4} placeholder="Describe your approach, experience, and why you're the best fit..."
              value={bidForm.message} onChange={(e) => setBidForm({ ...bidForm, message: e.target.value })}
              style={{ width: '100%', border: '1.5px solid #e2e2f0', borderRadius: 10, padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
            />
          </div>
          <button type="submit" disabled={bidLoading} style={{ width: '100%', background: bidLoading ? '#a5b4fc' : '#4f46e5', color: '#fff', border: 'none', padding: 12, borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            {bidLoading ? 'Submitting...' : 'Submit Proposal →'}
          </button>
        </form>
      </Modal>
    </div>
  )
}