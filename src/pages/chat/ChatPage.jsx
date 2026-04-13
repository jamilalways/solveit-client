import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { getMessages } from '../../api/chat.api'
import { getContract, completeContract, submitSolution } from '../../api/contracts.api'
import { timeAgo } from '../../utils/formatDate'

export default function ChatPage() {
  const { contractId } = useParams()
  const { user }       = useAuth()
  const socket         = useSocket()
  const navigate       = useNavigate()
  const bottomRef      = useRef(null)

  const [contract, setContract] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText]         = useState('')
  const [sending, setSending]   = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      try {
        const [msgRes, ctrRes] = await Promise.all([
          getMessages(contractId),
          getContract(contractId)
        ])
        setMessages(msgRes.data.messages)
        setContract(ctrRes.data.contract)
      } catch { /* use empty */ }
    }
    fetch()
  }, [contractId])

  useEffect(() => {
    if (!socket) return
    socket.emit('join_room', contractId)
    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg])
    })
    return () => socket.off('receive_message')
  }, [socket, contractId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim()) return
    setSending(true)

    if (socket) {
      socket.emit('send_message', { contractId, message: text.trim() })
    }
    setText('')
    setSending(false)
  }

  const handleReleasePayment = async () => {
    if (!window.confirm('Are you sure you want to release the payment? This will complete the contract and cannot be undone.')) return
    setActionLoading(true)
    try {
      const res = await completeContract(contractId)
      setContract(res.data.contract)
      alert('Payment released successfully! The contract is now complete.')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to release payment.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubmitWork = async () => {
    if (!window.confirm('Are you sure you want to mark this job as done and submit your work to the client?')) return
    setActionLoading(true)
    try {
      const res = await submitSolution(contractId, { note: 'Work completed.' })
      setContract(res.data.contract)
      alert('Work submitted! Waiting for the client to release payment.')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit work.')
    } finally {
      setActionLoading(false)
    }
  }

  const myId = user?._id
  const isClient = user?.role === 'client'
  
  // Determine who the other person is based on contract
  let other = { name: 'Chat Partner', avatar: null }
  if (contract) {
    if (isClient) other = { name: contract.solver?.name || 'Solver', avatar: contract.solver?.avatar }
    else other = { name: contract.client?.name || 'Client', avatar: contract.client?.avatar }
  }

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, maxWidth: 780, margin: '0 auto', width: '100%', padding: '24px 16px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
        {/* Chat header */}
        <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: '16px 16px 0 0', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bg-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--text-brand)' }}>
            {other.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{other.name}</div>
            <div style={{ fontSize: 11, color: 'var(--success-text)', fontWeight: 600 }}>● Active</div>
          </div>
          
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Solver: Submit Work button */}
            {!isClient && contract && contract.status === 'active' && (
              <button 
                onClick={handleSubmitWork} 
                disabled={actionLoading}
                title="Mark this contract as completed and submit to client"
                style={{
                  background: '#2563eb', color: '#fff', border: 'none',
                  padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                  cursor: actionLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}>
                {actionLoading ? 'Processing...' : '✓ Submit Work'}
              </button>
            )}

            {/* Client: Release Payment button */}
            {isClient && contract && (contract.status === 'active' || contract.status === 'submitted') && (
              <button 
                onClick={handleReleasePayment} 
                disabled={actionLoading}
                title="Release the held escrow to the solver and complete the job"
                style={{
                  background: contract.status === 'submitted' ? 'var(--status-done-color)' : 'var(--text-faint)', 
                  color: '#fff', border: 'none',
                  padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700,
                  cursor: actionLoading ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
                }}>
                {actionLoading ? 'Processing...' : contract.status === 'submitted' ? '✓ Release Payment' : '✓ Early Release Payment'}
              </button>
            )}
            
            {contract?.status === 'submitted' && (
              <span style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', background: '#dbeafe', padding: '4px 10px', borderRadius: 6 }}>
                Reviewing
              </span>
            )}
            {contract?.status === 'completed' && (
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--status-done-color)', background: 'var(--status-done-bg)', padding: '4px 10px', borderRadius: 6 }}>
                Completed
              </span>
            )}
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Contract #{contractId?.slice(-6)}</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, background: 'var(--bg-card)', borderLeft: '1.5px solid var(--border-primary)', borderRight: '1.5px solid var(--border-primary)', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((msg) => {
            const isMe = msg.sender._id === myId
            return (
              <div key={msg._id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '68%' }}>
                  {!isMe && (
                    <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 3, paddingLeft: 4 }}>{msg.sender.name}</div>
                  )}
                  <div style={{
                    background: isMe ? 'var(--msg-me-bg)' : 'var(--msg-other-bg)',
                    color: isMe ? 'var(--msg-me-color)' : 'var(--msg-other-color)',
                    borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    padding: '10px 14px', fontSize: 14, lineHeight: 1.5,
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 3, textAlign: isMe ? 'right' : 'left', paddingLeft: 4 }}>
                    {timeAgo(msg.createdAt)}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border-primary)', borderRadius: '0 0 16px 16px', padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="text" placeholder="Type a message..." value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ flex: 1, border: '1.5px solid var(--input-border)', borderRadius: 10, padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none', background: 'var(--input-bg)', color: 'var(--text-primary)' }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--input-focus)')}
            onBlur={(e)  => (e.target.style.borderColor = 'var(--input-border)')}
          />
          <button type="submit" disabled={!text.trim() || sending} style={{
            background: text.trim() ? '#4f46e5' : 'var(--bg-tertiary)', color: text.trim() ? '#fff' : 'var(--text-faint)',
            border: 'none', padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 700,
            cursor: text.trim() ? 'pointer' : 'not-allowed', fontFamily: 'inherit', whiteSpace: 'nowrap',
          }}>
            Send →
          </button>
        </form>
      </div>
    </div>
  )
}