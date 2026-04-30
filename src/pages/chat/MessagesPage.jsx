import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Spinner from '../../components/common/Spinner'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { getConversations, getDirectMessages, startConversation, sendDirectMessage } from '../../api/dm.api'
import { getContractByProblem, submitSolution, completeContract } from '../../api/contracts.api'
import { timeAgo } from '../../utils/formatDate'
import getImageUrl from '../../utils/getImageUrl'

export default function MessagesPage() {
  const { conversationId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const socket   = useSocket()
  const bottomRef = useRef(null)

  const [conversations, setConversations] = useState([])
  const [activeConv, setActiveConv]       = useState(conversationId || null)
  const [messages, setMessages]           = useState([])
  const [text, setText]                   = useState('')
  const [loading, setLoading]             = useState(true)
  const [msgLoading, setMsgLoading]       = useState(false)
  const [sending, setSending]             = useState(false)
  const [activeContract, setActiveContract] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  // Sync activeConv with URL param
  useEffect(() => {
    if (conversationId && conversationId !== activeConv) {
      setActiveConv(conversationId)
    }
  }, [conversationId, activeConv])

  // Fetch conversation list
  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getConversations()
        setConversations(res.data.conversations || [])
      } catch { /* empty */ }
      setLoading(false)
    }
    fetch()
  }, [])

  // When activeConv changes, fetch messages
  useEffect(() => {
    if (!activeConv) return
    const fetchMsgs = async () => {
      setMsgLoading(true)
      try {
        const res = await getDirectMessages(activeConv)
        setMessages(res.data.messages || [])

        // Also fetch contract if there's a problem linked
        const conv = conversations.find(c => c._id === activeConv)
        if (conv?.problem) {
          try {
            const cRes = await getContractByProblem(conv.problem._id || conv.problem)
            setActiveContract(cRes.data.contract)
          } catch { setActiveContract(null) }
        } else {
          setActiveContract(null)
        }
      } catch { /* empty */ }
      setMsgLoading(false)
    }
    fetchMsgs()
  }, [activeConv, conversations])

  // Socket join/leave
  useEffect(() => {
    if (!socket || !activeConv) return
    socket.emit('join_dm', activeConv)
    socket.on('receive_dm', (msg) => {
      setMessages((prev) => [...prev, msg])
      // Update conversation list last message
      setConversations((prev) =>
        prev.map((c) =>
          c._id === activeConv ? { ...c, lastMessage: msg.text, lastMessageAt: msg.createdAt, unreadCount: 0 } : c
        )
      )
    })
    return () => {
      socket.emit('leave_dm', activeConv)
      socket.off('receive_dm')
    }
  }, [socket, activeConv])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!text.trim() || !activeConv) return
    const msgText = text.trim()
    setText('')
    setSending(true)
    
    try {
      await sendDirectMessage(activeConv, { text: msgText })
    } catch (err) {
      console.error('Send message failed:', err)
      alert('Failed to send message. Please check your connection.')
      setText(msgText) // restore text if failed
    } finally {
      setSending(false)
    }
  }

  const handleReleasePayment = async () => {
    if (!activeContract) return
    if (!window.confirm('Are you sure you want to release the payment? This will complete the contract.')) return
    setActionLoading(true)
    try {
      const res = await completeContract(activeContract._id)
      setActiveContract(res.data.contract)
      alert('Payment released successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to release payment.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSubmitWork = async () => {
    if (!activeContract) return
    if (!window.confirm('Are you sure you want to submit your work to the client?')) return
    setActionLoading(true)
    try {
      const res = await submitSolution(activeContract._id, { note: 'Work completed via messages.' })
      setActiveContract(res.data.contract)
      alert('Work submitted successfully!')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit work.')
    } finally {
      setActionLoading(false)
    }
  }

  const getOtherUser = (conv) => {
    return conv.participants?.find((p) => p._id !== user?._id) || { name: 'Unknown' }
  }

  const StatusStepper = ({ status }) => {
    if (!status) return null
    const steps = [
      { id: 'active', label: 'Working' },
      { id: 'submitted', label: 'Reviewing' },
      { id: 'completed', label: 'Done' }
    ]
    const getStepIndex = (s) => steps.findIndex(step => step.id === s)
    const currentIndex = getStepIndex(status)

    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 24 }}>
        {steps.map((step, i) => (
          <div key={step.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6, textTransform: 'uppercase',
              background: i <= currentIndex ? 'var(--bg-accent)' : 'var(--bg-tertiary)',
              color: i <= currentIndex ? 'var(--text-brand)' : 'var(--text-faint)',
              border: i === currentIndex ? '1.5px solid var(--text-brand)' : '1.5px solid transparent',
              transition: 'all 0.2s',
            }}>
              {step.label}
            </div>
            {i < steps.length - 1 && <i className="fi fi-rr-angle-small-right" style={{ fontSize: 12, color: 'var(--text-faint)' }}></i>}
          </div>
        ))}
      </div>
    )
  }

  const renderAvatar = (u, size = 40) => {
    if (u?.avatar) {
      return (
        <img src={getImageUrl(u.avatar)} alt="" style={{ width: size, height: size, borderRadius: size * 0.25, objectFit: 'cover' }} />
      )
    }
    return (
      <div style={{
        width: size, height: size, borderRadius: size * 0.25,
        background: 'var(--bg-accent)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: size * 0.32, fontWeight: 700, color: 'var(--text-brand)',
      }}>
        {u?.name?.slice(0, 2).toUpperCase() || '??'}
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div style={{ flex: 1, maxWidth: 1000, margin: '0 auto', width: '100%', display: 'flex', height: 'calc(100vh - 100px)', background: 'var(--bg-card)', borderRadius: 16, border: '1.5px solid var(--border-primary)', overflow: 'hidden' }}>
        {/* Left — Conversation list */}
        <div style={{ width: 300, borderRight: '1.5px solid var(--border-primary)', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-primary)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}> Messages</h2>
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? <Spinner /> : conversations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)', fontSize: 13 }}>
                No conversations yet
              </div>
            ) : (
              conversations.map((conv) => {
                const other = getOtherUser(conv)
                const isActive = conv._id === activeConv
                return (
                  <div key={conv._id}
                    onClick={() => { setActiveConv(conv._id); navigate(`/messages/${conv._id}`, { replace: true }) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 16px', cursor: 'pointer',
                      background: isActive ? 'var(--bg-accent)' : 'transparent',
                      borderBottom: '1px solid var(--border-light)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)' }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent' }}
                  >
                    {renderAvatar(other, 38)}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{other.name}</span>
                        {conv.unreadCount > 0 && (
                          <span style={{ background: '#4f46e5', color: '#fff', fontSize: 10, fontWeight: 700, borderRadius: 10, padding: '1px 7px', minWidth: 18, textAlign: 'center' }}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      {conv.problem && (
                        <div style={{ fontSize: 10, color: 'var(--text-brand)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 2 }}>
                          Problem: {conv.problem.title}
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: 'var(--text-faint)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {conv.lastMessage || 'Start chatting...'}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Right — Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', overflow: 'hidden' }}>
          {!activeConv ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 8, color: 'var(--text-muted)' }}>
              <span style={{ fontSize: 48 }}>💬</span>
              <span style={{ fontSize: 15, fontWeight: 600 }}>Select a conversation</span>
              <span style={{ fontSize: 12 }}>or start one from a user's profile</span>
            </div>
          ) : (
            <>
              {/* Chat header */}
              {(() => {
                const conv = conversations.find((c) => c._id === activeConv)
                const other = conv ? getOtherUser(conv) : { name: 'Chat' }
                return (
                  <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-primary)', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div 
                      onClick={() => navigate(`/profile/${other._id}`)}
                      style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                    >
                      {renderAvatar(other, 36)}
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{other.name}</div>
                        {conv?.problem && (
                          <div style={{ fontSize: 11, color: 'var(--text-brand)', fontWeight: 600 }}>
                            Topic: {conv.problem.title}
                          </div>
                        )}
                        <div style={{ fontSize: 11, color: 'var(--success-text)', fontWeight: 600 }}>● Online</div>
                      </div>
                    </div>

                    {/* Status Stepper */}
                    {activeContract && (
                      <div style={{ marginLeft: 20 }}>
                        <StatusStepper status={activeContract.status} />
                      </div>
                    )}

                    <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
                      {/* Solver Action */}
                      {user?.role === 'solver' && activeContract && activeContract.status === 'active' && (
                        <button onClick={handleSubmitWork} disabled={actionLoading} style={{
                          background: '#2563eb', color: '#fff', border: 'none', padding: '6px 12px',
                          borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: actionLoading ? 'not-allowed' : 'pointer',
                        }}>
                          {actionLoading ? '...' : 'Submit Work'}
                        </button>
                      )}

                      {/* Client Action */}
                      {user?.role === 'client' && activeContract && activeContract.status === 'submitted' && (
                        <button onClick={handleReleasePayment} disabled={actionLoading} style={{
                          background: 'var(--status-done-color)', color: '#fff', border: 'none', padding: '6px 12px',
                          borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: actionLoading ? 'not-allowed' : 'pointer',
                        }}>
                          {actionLoading ? '...' : 'Release Payment'}
                        </button>
                      )}
                      
                      {activeContract?.status === 'completed' && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--status-done-color)', background: 'var(--status-done-bg)', padding: '4px 10px', borderRadius: 6 }}>
                          Contract Completed
                        </span>
                      )}
                    </div>
                  </div>
                )
              })()}

              {/* Messages */}
              <div style={{ flex: 1, padding: 20, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {msgLoading ? <Spinner /> : messages.map((msg) => {
                  const isMe = msg.sender?._id === user?._id
                  return (
                    <div key={msg._id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '68%' }}>
                        {!isMe && (
                          <div style={{ fontSize: 11, color: 'var(--text-faint)', marginBottom: 3, paddingLeft: 4 }}>{msg.sender?.name}</div>
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
              <form onSubmit={handleSend} style={{ padding: '12px 16px', borderTop: '1px solid var(--border-primary)', display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="text" placeholder="Type a message..." value={text}
                  onChange={(e) => setText(e.target.value)}
                  style={{
                    flex: 1, border: '1.5px solid var(--input-border)', borderRadius: 10,
                    padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none',
                    background: 'var(--input-bg)', color: 'var(--text-primary)',
                  }}
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
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

