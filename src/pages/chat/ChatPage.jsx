import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { getMessages } from '../../api/chat.api'
import { timeAgo } from '../../utils/formatDate'

const DEMO_MESSAGES = [
  { _id: '1', sender: { _id: 'c1', name: 'Arif Khan' },  text: 'Hi! I just accepted your bid. When can you start?', createdAt: new Date(Date.now() - 3600000) },
  { _id: '2', sender: { _id: 's1', name: 'Samin Reza' }, text: 'Hello! I can start right away. Can you share access to the codebase?', createdAt: new Date(Date.now() - 3000000) },
  { _id: '3', sender: { _id: 'c1', name: 'Arif Khan' },  text: 'Sure, I will share the GitHub repo link now.', createdAt: new Date(Date.now() - 2400000) },
  { _id: '4', sender: { _id: 's1', name: 'Samin Reza' }, text: 'Perfect. I will review it and give you an update by tomorrow morning.', createdAt: new Date(Date.now() - 1800000) },
]

export default function ChatPage() {
  const { contractId } = useParams()
  const { user }       = useAuth()
  const socket         = useSocket()
  const bottomRef      = useRef(null)

  const [messages, setMessages] = useState(DEMO_MESSAGES)
  const [text, setText]         = useState('')
  const [sending, setSending]   = useState(false)
  const [other]                 = useState({ name: 'Arif Khan', avatar: 'AK' })

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getMessages(contractId)
        setMessages(res.data.messages)
      } catch { /* use demo */ }
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

    const msg = { _id: Date.now(), sender: { _id: user?._id, name: user?.name }, text: text.trim(), createdAt: new Date() }
    setMessages((prev) => [...prev, msg])

    if (socket) {
      socket.emit('send_message', { contractId, message: text.trim() })
    }
    setText('')
    setSending(false)
  }

  const myId = user?._id || 's1'

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8f9fc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ flex: 1, maxWidth: 780, margin: '0 auto', width: '100%', padding: '24px 16px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 64px)' }}>
        {/* Chat header */}
        <div style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: '16px 16px 0 0', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#4f46e5' }}>
            {other.avatar}
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{other.name}</div>
            <div style={{ fontSize: 11, color: '#22c55e', fontWeight: 600 }}>● Online</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 12, color: '#888' }}>Contract #{contractId?.slice(-6)}</div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, background: '#fff', borderLeft: '1.5px solid #f0f0f8', borderRight: '1.5px solid #f0f0f8', padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {messages.map((msg) => {
            const isMe = msg.sender._id === myId
            return (
              <div key={msg._id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '68%' }}>
                  {!isMe && (
                    <div style={{ fontSize: 11, color: '#aaa', marginBottom: 3, paddingLeft: 4 }}>{msg.sender.name}</div>
                  )}
                  <div style={{
                    background: isMe ? '#4f46e5' : '#f5f5f8',
                    color: isMe ? '#fff' : '#1a1a2e',
                    borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    padding: '10px 14px', fontSize: 14, lineHeight: 1.5,
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: 10, color: '#ccc', marginTop: 3, textAlign: isMe ? 'right' : 'left', paddingLeft: 4 }}>
                    {timeAgo(msg.createdAt)}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} style={{ background: '#fff', border: '1.5px solid #f0f0f8', borderRadius: '0 0 16px 16px', padding: '12px 16px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            type="text" placeholder="Type a message..." value={text}
            onChange={(e) => setText(e.target.value)}
            style={{ flex: 1, border: '1.5px solid #e2e2f0', borderRadius: 10, padding: '10px 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }}
            onFocus={(e) => (e.target.style.borderColor = '#6366f1')}
            onBlur={(e)  => (e.target.style.borderColor = '#e2e2f0')}
          />
          <button type="button" style={{ width: 38, height: 38, border: '1.5px solid #e2e2f0', borderRadius: 10, background: '#fff', cursor: 'pointer', fontSize: 18 }}>📎</button>
          <button type="submit" disabled={!text.trim() || sending} style={{
            background: text.trim() ? '#4f46e5' : '#e2e2f0', color: text.trim() ? '#fff' : '#aaa',
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