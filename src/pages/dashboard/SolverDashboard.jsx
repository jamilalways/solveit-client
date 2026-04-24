import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/common/Modal'
import ReviewModal from '../../components/common/ReviewModal'
import Spinner from '../../components/common/Spinner'
import { useAuth } from '../../context/AuthContext'
import { formatBDT } from '../../utils/formatCurrency'
import { getContracts } from '../../api/contracts.api'
import { getMyBids } from '../../api/bids.api'
import { getWallet, withdrawFunds } from '../../api/payments.api'
import { supportApi } from '../../api/support.api'

const statusStyle = {
  active:         { bg: 'var(--status-active-bg)',  color: 'var(--status-active-color)', label: 'In Progress' },
  submitted:      { bg: 'var(--status-review-bg)',  color: 'var(--status-review-color)', label: 'Submitted'   },
  pending_payment:{ bg: 'var(--status-open-bg)',    color: 'var(--status-open-color)',   label: 'Pending'     },
  completed:      { bg: 'var(--status-done-bg)',    color: 'var(--status-done-color)',   label: 'Completed'   },
  cancelled:      { bg: 'var(--error-bg)',          color: 'var(--error-text)',          label: 'Cancelled'   },
  pending:        { bg: 'var(--status-open-bg)',    color: 'var(--status-open-color)',   label: 'Pending'     },
  accepted:       { bg: 'var(--status-done-bg)',    color: 'var(--status-done-color)',   label: 'Accepted'    },
  rejected:       { bg: 'var(--error-bg)',          color: 'var(--error-text)',          label: 'Rejected'    },
}

export default function SolverDashboard() {
  const { user } = useAuth()
  
  const [jobs, setJobs] = useState([])
  const [bids, setBids] = useState([])
  const [wallet, setWallet] = useState({ balance: 0, transactions: [] })
  const [loading, setLoading] = useState(true)

  // Withdraw modal state
  const [withdrawModal, setWithdrawModal] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletMsg, setWalletMsg] = useState('')

  // Review modal state
  const [reviewModal, setReviewModal] = useState({ open: false, contractId: null })

  // Support modal state
  const [supportModal, setSupportModal] = useState(false)
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' })
  const [supportLoading, setSupportLoading] = useState(false)
  const [supportMsg, setSupportMsg] = useState({ type: '', text: '' })

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [contractsRes, bidsRes, walletRes] = await Promise.all([
          getContracts().catch(() => ({ data: { contracts: [] } })),
          getMyBids().catch(() => ({ data: { bids: [] } })),
          getWallet().catch(() => ({ data: { wallet: { balance: 0 } } })),
        ])
        setJobs(contractsRes.data.contracts || [])
        setBids(bidsRes.data.bids || [])
        setWallet({ balance: walletRes.data.wallet?.balance || 0, transactions: walletRes.data.transactions || [] })
      } catch {
        // Handle failure
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const totalEarned = jobs.filter((j) => j.status === 'completed').reduce((s, j) => s + j.amount, 0)

  const handleWithdraw = async () => {
    const amount = Number(withdrawAmount)
    if (!amount || amount <= 0) return setWalletMsg('Enter a valid amount.')
    if (amount > wallet.balance) return setWalletMsg('Insufficient balance.')
    
    setWalletLoading(true)
    setWalletMsg('')
    try {
      const res = await withdrawFunds({ amount })
      setWallet((prev) => ({ ...prev, balance: res.data.wallet.balance }))
      setWalletMsg(res.data.message || 'Success!')
      setWithdrawAmount('')
      setTimeout(() => { setWithdrawModal(false); setWalletMsg('') }, 1500)
    } catch (err) {
      setWalletMsg(err.response?.data?.message || 'Withdrawal failed.')
    } finally {
      setWalletLoading(false)
    }
  }

  const handleSupportSubmit = async () => {
    if (!supportForm.subject || !supportForm.message) {
      return setSupportMsg({ type: 'error', text: 'Please fill all fields.' })
    }
    setSupportLoading(true)
    try {
      await supportApi.createTicket(supportForm)
      setSupportMsg({ type: 'success', text: 'Support ticket submitted successfully!' })
      setTimeout(() => {
        setSupportModal(false)
        setSupportForm({ subject: '', message: '' })
        setSupportMsg({ type: '', text: '' })
      }, 2000)
    } catch (error) {
      setSupportMsg({ type: 'error', text: error.response?.data?.message || 'Failed to submit.' })
    } finally {
      setSupportLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    if (hour < 21) return 'Good evening'
    return 'Good night'
  }

  const inputStyle = {
    width: '100%', border: '1.5px solid var(--input-border)', borderRadius: 10,
    padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', color: 'var(--text-primary)', background: 'var(--input-bg)',
  }

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 3 }}>
            {getGreeting()}, {user?.name?.split(' ')[0]} ⚡
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Your solver overview</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => { setSupportModal(true); setSupportMsg({ type: '', text: '' }) }} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1.5px solid var(--border-primary)', padding: '10px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Help / Support
          </button>
          <Link to="/problems" style={{ background: '#4f46e5', color: '#fff', padding: '10px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
            Browse Problems →
          </Link>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
            {[
              { label: 'Active jobs',    value: jobs.filter(j => j.status === 'active' || j.status === 'submitted').length, color: '#2563eb' },
              { label: 'Completed',      value: jobs.filter(j => j.status === 'completed').length, color: '#16a34a' },
              { label: 'Total earned',   value: formatBDT(totalEarned),                                 color: '#4f46e5' },
              { label: 'Avg rating',     value: `${user?.avgRating?.toFixed(1) || '0.0'} ★`,           color: '#f97316' },
            ].map((s) => (
              <div key={s.label} style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 14, padding: '16px 20px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
                <div style={{ fontSize: s.label === 'Total earned' ? 18 : 28, fontWeight: 800, color: s.color, marginTop: 6 }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Wallet card */}
          <div style={{ background: 'var(--wallet-gradient)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, color: '#fff' }}>
            <div style={{ fontSize: 12, fontWeight: 700, opacity: .7, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>My Wallet</div>
            <div style={{ display: 'flex', gap: 40, alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, opacity: .7 }}>Available balance</div>
                <div style={{ fontSize: 26, fontWeight: 800 }}>{formatBDT(wallet.balance)}</div>
              </div>
              <button onClick={() => { setWithdrawModal(true); setWithdrawAmount(''); setWalletMsg('') }}
                style={{ background: 'rgba(255,255,255,.2)', color: '#fff', border: '1px solid rgba(255,255,255,.3)', padding: '9px 24px', borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
                Withdraw Funds
              </button>
            </div>
          </div>

          {/* Recent Activity / Transactions */}
          {wallet.transactions && wallet.transactions.length > 0 && (
            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: '20px 24px', marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 16 }}>💰 Account Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {wallet.transactions.slice(0, 4).map((tx) => (
                  <div key={tx._id} style={{ display: 'flex', alignItems: 'flex-start', padding: '12px 16px', background: 'var(--bg-primary)', borderRadius: 12, border: '1px solid var(--border-light)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.4 }}>
                        {tx.description}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--text-faint)' }}>
                        {new Date(tx.createdAt).toLocaleDateString()} at {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: tx.type === 'payment_received' || tx.type === 'deposit' ? 'var(--status-done-color)' : 'var(--error-text)', marginLeft: 16, whiteSpace: 'nowrap' }}>
                      {tx.type === 'payment_received' || tx.type === 'deposit' ? '+' : '-'} {formatBDT(tx.amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24 }}>
            {/* Contracts */}
            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>My Contracts</div>
              {jobs.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No contracts found.</div>
              ) : jobs.map((job) => {
                const ss = statusStyle[job.status] || statusStyle.active
                return (
                  <div key={job._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div>
                      <Link to={`/chat/${job._id}`} style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}
                        onMouseEnter={(e) => (e.target.style.color = '#4f46e5')}
                        onMouseLeave={(e) => (e.target.style.color = 'var(--text-primary)')}
                      >{job.problem?.title || 'Contract'}</Link>
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 3 }}>
                        Client: {job.client?.name} · {formatBDT(job.amount)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6 }}>
                        {ss.label}
                      </span>
                      {job.status === 'completed' && (
                        <button
                          onClick={() => setReviewModal({ open: true, contractId: job._id })}
                          style={{
                            background: 'none', border: '1.5px solid var(--border-secondary)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: 'var(--text-brand)'
                          }}
                        >
                          Leave Review
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* My bids */}
            <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: 24 }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>Recent Bids</div>
              {bids.length === 0 ? (
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>You haven't placed any bids yet.</div>
              ) : bids.map((bid) => {
                const ss = statusStyle[bid.status] || statusStyle.pending
                return (
                  <div key={bid._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div>
                      <Link to={`/problems/${bid.problem?._id}`} style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}
                        onMouseEnter={(e) => (e.target.style.color = '#4f46e5')}
                        onMouseLeave={(e) => (e.target.style.color = 'var(--text-primary)')}
                      >
                        {bid.problem?.title || 'Problem Post'}
                      </Link>
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 3 }}>Proposed: {formatBDT(bid.proposedPrice)}</div>
                    </div>
                    <span style={{ background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, marginLeft: 16 }}>
                      {ss.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {/* ─── Withdraw Modal ─────────────────────── */}
      <Modal open={withdrawModal} onClose={() => setWithdrawModal(false)} title="💸 Withdraw Funds">
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
            Amount (৳)
          </label>
          <input
            type="number" min="1" max={wallet.balance} placeholder={`Max available: ৳${wallet.balance}`} value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
            onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
          />
        </div>
        {walletMsg && (
          <div style={{
            padding: '8px 12px', borderRadius: 8, fontSize: 13, marginBottom: 12,
            background: walletMsg.includes('success') || walletMsg.includes('Success')
              ? 'var(--status-done-bg)' : 'var(--error-bg)',
            color: walletMsg.includes('success') || walletMsg.includes('Success')
              ? 'var(--status-done-color)' : 'var(--error-text)',
          }}>
            {walletMsg}
          </div>
        )}
        <button onClick={handleWithdraw} disabled={walletLoading}
          style={{
            width: '100%', background: walletLoading ? '#a5b4fc' : '#4f46e5', color: '#fff',
            border: 'none', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 700,
            cursor: walletLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
          }}>
          {walletLoading ? 'Processing...' : 'Withdraw →'}
        </button>
      </Modal>

      {/* ─── Review Modal ────────────────────── */}
      <ReviewModal 
        open={reviewModal.open} 
        onClose={() => setReviewModal({ open: false, contractId: null })}
        contractId={reviewModal.contractId}
        onReviewSuccess={() => alert('Review submitted successfully!')}
      />

      {/* ─── Support Modal ──────────────────────── */}
      <Modal open={supportModal} onClose={() => setSupportModal(false)} title="🎧 Get Support">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Subject</label>
            <input value={supportForm.subject} onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
              style={inputStyle} placeholder="E.g., Payment issue" />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Message</label>
            <textarea rows={4} value={supportForm.message}
              onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }} placeholder="Please describe your problem..." />
          </div>
          {supportMsg.text && (
            <div style={{ background: supportMsg.type === 'success' ? 'var(--status-done-bg)' : 'var(--error-bg)', color: supportMsg.type === 'success' ? 'var(--status-done-color)' : 'var(--error-text)', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}>{supportMsg.text}</div>
          )}
          <button onClick={handleSupportSubmit} disabled={supportLoading}
            style={{
              width: '100%', background: supportLoading ? '#a5b4fc' : '#4f46e5', color: '#fff',
              border: 'none', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 700,
              cursor: supportLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}>
            {supportLoading ? 'Submitting...' : 'Submit Support Ticket →'}
          </button>
        </div>
      </Modal>

    </DashboardLayout>
  )
}