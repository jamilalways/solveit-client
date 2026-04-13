import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Modal from '../../components/common/Modal'
import Spinner from '../../components/common/Spinner'
import { useAuth } from '../../context/AuthContext'
import { formatBDT } from '../../utils/formatCurrency'
import { formatDate, daysLeft } from '../../utils/formatDate'
import { getMyProblems, updateProblem, deleteProblem } from '../../api/problems.api'
import { getWallet, depositFunds, withdrawFunds } from '../../api/payments.api'
import { getContracts } from '../../api/contracts.api'
import { getIncomingBids } from '../../api/bids.api'

const statusStyle = {
  open:       { bg: 'var(--status-open-bg)',   color: 'var(--status-open-color)',   label: 'Open'        },
  active:     { bg: 'var(--status-active-bg)',  color: 'var(--status-active-color)', label: 'In Progress' },
  in_review:  { bg: 'var(--status-review-bg)',  color: 'var(--status-review-color)', label: 'Under Review'},
  completed:  { bg: 'var(--status-done-bg)',    color: 'var(--status-done-color)',   label: 'Completed'   },
}

export default function ClientDashboard() {
  const { user } = useAuth()
  const [jobs, setJobs]         = useState([])
  const [contracts, setContracts] = useState([])
  const [bids, setBids]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [wallet, setWallet]     = useState({ balance: 0, escrow: 0, transactions: [] })

  // Deposit/Withdraw modal
  const [walletModal, setWalletModal]   = useState(null) // 'deposit' | 'withdraw' | null
  const [walletAmount, setWalletAmount] = useState('')
  const [walletLoading, setWalletLoading] = useState(false)
  const [walletMsg, setWalletMsg]       = useState('')

  // Edit modal
  const [editJob, setEditJob] = useState(null)
  const [editForm, setEditForm] = useState({ title: '', description: '', budget: '', deadline: '' })
  const [editLoading, setEditLoading] = useState(false)
  const [editError, setEditError] = useState('')

  // Delete modal
  const [deleteId, setDeleteId]     = useState(null)
  const [delLoading, setDelLoading] = useState(false)

  // Fetch problems & wallet
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [probRes, walletRes, contractsRes, bidsRes] = await Promise.all([
          getMyProblems(),
          getWallet().catch(() => ({ data: { wallet: { balance: 0, escrowBalance: 0 } } })),
          getContracts().catch(() => ({ data: { contracts: [] } })),
          getIncomingBids().catch(() => ({ data: { bids: [] } })),
        ])
        setJobs(probRes.data.problems || [])
        const w = walletRes.data.wallet
        setWallet({ balance: w.balance || 0, escrow: w.escrowBalance || 0, transactions: walletRes.data.transactions || [] })
        setContracts(contractsRes.data.contracts || [])
        setBids(bidsRes.data.bids || [])
      } catch {
        // fallback
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = {
    total:     jobs.length,
    active:    jobs.filter((j) => j.status === 'active').length,
    completed: jobs.filter((j) => j.status === 'completed').length,
    open:      jobs.filter((j) => j.status === 'open').length,
  }

  // Deposit / Withdraw
  const handleWalletAction = async () => {
    const amount = Number(walletAmount)
    if (!amount || amount <= 0) return setWalletMsg('Enter a valid amount.')
    setWalletLoading(true)
    setWalletMsg('')
    try {
      const fn = walletModal === 'deposit' ? depositFunds : withdrawFunds
      const res = await fn({ amount })
      const w = res.data.wallet
      setWallet((prev) => ({ ...prev, balance: w.balance || 0, escrow: w.escrowBalance || 0 }))
      setWalletMsg(res.data.message || 'Success!')
      setWalletAmount('')
      setTimeout(() => { setWalletModal(null); setWalletMsg('') }, 1500)
    } catch (err) {
      setWalletMsg(err.response?.data?.message || 'Action failed.')
    } finally {
      setWalletLoading(false)
    }
  }

  // Edit helpers
  const openEdit = (job) => {
    setEditJob(job)
    setEditForm({
      title: job.title,
      description: job.description || '',
      budget: job.budget,
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
    })
    setEditError('')
  }

  const handleEdit = async () => {
    setEditLoading(true)
    setEditError('')
    try {
      const res = await updateProblem(editJob._id, {
        title: editForm.title,
        description: editForm.description,
        budget: Number(editForm.budget),
        deadline: editForm.deadline,
      })
      setJobs((prev) => prev.map((j) => (j._id === editJob._id ? res.data.problem : j)))
      setEditJob(null)
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update.')
    } finally {
      setEditLoading(false)
    }
  }

  // Delete helpers
  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await deleteProblem(deleteId)
      setJobs((prev) => prev.filter((j) => j._id !== deleteId))
      setDeleteId(null)
    } catch {
      // failed
    } finally {
      setDelLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', border: '1.5px solid var(--input-border)', borderRadius: 10,
    padding: '10px 13px', fontSize: 14, fontFamily: 'inherit', outline: 'none',
    boxSizing: 'border-box', color: 'var(--text-primary)', background: 'var(--input-bg)',
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 3 }}>
            Good morning, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Here's your client overview</p>
        </div>
        <Link to="/post-problem" style={{ background: '#4f46e5', color: '#fff', padding: '10px 22px', borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none' }}>
          + Post a Problem
        </Link>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Total jobs',   value: stats.total,     color: '#4f46e5', bg: 'var(--status-open-bg)'  },
          { label: 'Active',       value: stats.active,    color: '#2563eb', bg: 'var(--status-active-bg)' },
          { label: 'Completed',    value: stats.completed, color: '#16a34a', bg: 'var(--status-done-bg)'  },
          { label: 'Awaiting bids',value: stats.open,      color: '#d97706', bg: 'var(--status-review-bg)' },
        ].map((s) => (
          <div key={s.label} style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 14, padding: '16px 20px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, marginTop: 6 }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Wallet card */}
      <div style={{ background: 'var(--wallet-gradient)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, color: '#fff' }}>
        <div style={{ fontSize: 12, fontWeight: 700, opacity: .7, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 12 }}>My Wallet</div>
        <div style={{ display: 'flex', gap: 40 }}>
          <div>
            <div style={{ fontSize: 11, opacity: .7 }}>Available balance</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{formatBDT(wallet.balance)}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, opacity: .7 }}>In escrow</div>
            <div style={{ fontSize: 26, fontWeight: 800 }}>{formatBDT(wallet.escrow)}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={() => { setWalletModal('deposit'); setWalletAmount(''); setWalletMsg('') }}
            style={{ background: 'rgba(255,255,255,.2)', color: '#fff', border: '1px solid rgba(255,255,255,.3)', padding: '7px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            + Deposit
          </button>
          <button onClick={() => { setWalletModal('withdraw'); setWalletAmount(''); setWalletMsg('') }}
            style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,.3)', padding: '7px 18px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Withdraw
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
                <div style={{ fontSize: 14, fontWeight: 800, color: tx.type === 'deposit' || tx.type === 'refund' ? 'var(--status-done-color)' : 'var(--error-text)', marginLeft: 16, whiteSpace: 'nowrap' }}>
                  {tx.type === 'deposit' || tx.type === 'refund' ? '+' : '-'} {formatBDT(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 24, paddingBottom: 40 }}>
        
        {/* Active Contracts */}
        <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>Active Contracts</div>
          {loading ? <Spinner /> : contracts.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No active contracts.</div>
          ) : contracts.map((contract) => {
            const ss = statusStyle[contract.status] || statusStyle.active
            return (
              <div key={contract._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <Link to={`/chat/${contract._id}`} style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-brand)', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--text-brand)')}
                  >{contract.problem?.title || 'Contract'}</Link>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 3 }}>
                    Solver: {contract.solver?.name} · {formatBDT(contract.amount)}
                  </div>
                </div>
                <span style={{ background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, marginLeft: 16 }}>
                  {ss.label || contract.status}
                </span>
              </div>
            )
          })}
        </div>

        {/* Recent Proposals */}
        <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>Recent Proposals</div>
          {loading ? <Spinner /> : bids.length === 0 ? (
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>No pending proposals on your problems.</div>
          ) : bids.map((bid) => {
            return (
              <div key={bid._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <Link to={`/problems/${bid.problem?._id}`} style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-brand)', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.target.style.color = 'var(--text-primary)')}
                    onMouseLeave={(e) => (e.target.style.color = 'var(--text-brand)')}
                  >
                    {bid.problem?.title || 'Problem Post'}
                  </Link>
                  <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 3 }}>
                    By {bid.solver?.name} · Proposed: {formatBDT(bid.proposedPrice)}
                  </div>
                </div>
                <Link to={`/problems/${bid.problem?._id}`} style={{ background: 'var(--bg-accent)', color: 'var(--text-brand)', fontSize: 11, fontWeight: 700, padding: '5px 12px', borderRadius: 8, textDecoration: 'none' }}>
                  Review Bid →
                </Link>
              </div>
            )
          })}
        </div>

        {/* Jobs table */}
        <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: 16, padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>My Posted Problems</div>
          {loading ? <Spinner /> : jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>No problems posted yet</div>
              <Link to="/post-problem" style={{ color: 'var(--text-brand)', fontSize: 13, fontWeight: 700, textDecoration: 'none', marginTop: 8, display: 'inline-block' }}>Post your first problem →</Link>
            </div>
          ) : (
            <div>
              {jobs.map((job) => {
                const ss = statusStyle[job.status] || statusStyle.open
                return (
                  <div key={job._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: '1px solid var(--border-light)' }}>
                    <div style={{ flex: 1 }}>
                      <Link to={`/problems/${job._id}`} style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}
                        onMouseEnter={(e) => (e.target.style.color = '#4f46e5')}
                        onMouseLeave={(e) => (e.target.style.color = 'var(--text-primary)')}
                      >{job.title}</Link>
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 3 }}>
                        {job.category} · {formatBDT(job.budget)} · {daysLeft(job.deadline)} · {job.bidsCount || 0} bids
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ background: ss.bg, color: ss.color, fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 6, whiteSpace: 'nowrap' }}>
                        {ss.label}
                      </span>
                      {job.status === 'open' && (
                        <button onClick={() => openEdit(job)} title="Edit"
                          style={{ background: 'none', border: '1.5px solid var(--border-secondary)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 13, color: 'var(--text-brand)' }}>
                          ✏️
                        </button>
                      )}
                      <button onClick={() => setDeleteId(job._id)} title="Delete"
                        style={{ background: 'none', border: '1.5px solid var(--border-secondary)', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontSize: 13, color: 'var(--error-text)' }}>
                        🗑️
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── Deposit / Withdraw Modal ─────────────────────── */}
      <Modal open={!!walletModal} onClose={() => setWalletModal(null)} title={walletModal === 'deposit' ? '💰 Deposit Funds' : '💸 Withdraw Funds'}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
            Amount (৳)
          </label>
          <input
            type="number" min="1" placeholder="e.g. 5000" value={walletAmount}
            onChange={(e) => setWalletAmount(e.target.value)}
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
        <button onClick={handleWalletAction} disabled={walletLoading}
          style={{
            width: '100%', background: walletLoading ? '#a5b4fc' : '#4f46e5', color: '#fff',
            border: 'none', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 700,
            cursor: walletLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
          }}>
          {walletLoading ? 'Processing...' : walletModal === 'deposit' ? 'Deposit →' : 'Withdraw →'}
        </button>
      </Modal>

      {/* ─── Edit Problem Modal ───────────────────────────── */}
      <Modal open={!!editJob} onClose={() => setEditJob(null)} title="✏️ Edit Problem">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Title</label>
            <input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Description</label>
            <textarea rows={4} value={editForm.description}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Budget (৳)</label>
              <input type="number" value={editForm.budget} onChange={(e) => setEditForm({ ...editForm, budget: e.target.value })}
                style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>Deadline</label>
              <input type="date" value={editForm.deadline} onChange={(e) => setEditForm({ ...editForm, deadline: e.target.value })}
                style={inputStyle} />
            </div>
          </div>
          {editError && (
            <div style={{ background: 'var(--error-bg)', border: '1px solid var(--error-border)', color: 'var(--error-text)', borderRadius: 8, padding: '8px 12px', fontSize: 13 }}>{editError}</div>
          )}
          <button onClick={handleEdit} disabled={editLoading}
            style={{
              width: '100%', background: editLoading ? '#a5b4fc' : '#4f46e5', color: '#fff',
              border: 'none', padding: 12, borderRadius: 10, fontSize: 14, fontWeight: 700,
              cursor: editLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}>
            {editLoading ? 'Saving...' : 'Save Changes →'}
          </button>
        </div>
      </Modal>

      {/* ─── Delete Confirmation Modal ────────────────────── */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="🗑️ Delete Problem">
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
          Are you sure you want to delete this problem? This action <strong>cannot be undone</strong>.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setDeleteId(null)}
            style={{ flex: 1, background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-secondary)', padding: 10, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            Cancel
          </button>
          <button onClick={handleDelete} disabled={delLoading}
            style={{ flex: 1, background: '#dc2626', color: '#fff', border: 'none', padding: 10, borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: delLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
            {delLoading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}