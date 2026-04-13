import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Spinner from '../../components/common/Spinner'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { getConversations, getDirectMessages, startConversation } from '../../api/dm.api'
import { timeAgo } from '../../utils/formatDate'

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
      } catch { /* empty */ }
      setMsgLoading(false)
    }
    fetchMsgs()
  }, [activeConv])

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
    setSending(true)
    
    if (socket) {
      socket.emit('send_dm', { conversationId: activeConv, text: text.trim() })
    }
    setText('')
    setSending(false)
  }

  const getOtherUser = (conv) => {
    return conv.participants?.find((p) => p._id !== user?._id) || { name: 'Unknown' }
  }

  const apiBase = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5001'

  const renderAvatar = (u, size = 40) => {
    if (u?.avatar) {
      return (
        <img src={u.avatar.startsWith('http') ? u.avatar : `${apiBase}${u.avatar}`} alt="" style={{ width: size, height: size, borderRadius: size * 0.25, objectFit: 'cover' }} />
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
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, maxWidth: 1000, margin: '0 auto', width: '100%', padding: '24px 16px', display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* Left — Conversation list */}
        <div style={{ width: 300, borderRight: '1.5px solid var(--border-primary)', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', borderRadius: '16px 0 0 16px', overflow: 'hidden' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border-primary)' }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>💬 Messages</h2>
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--bg-card)', borderRadius: '0 16px 16px 0', overflow: 'hidden' }}>
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
                    {renderAvatar(other, 36)}
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{other.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--success-text)', fontWeight: 600 }}>● Online</div>
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
    </div>
  )
}
