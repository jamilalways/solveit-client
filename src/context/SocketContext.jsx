import { createContext, useEffect, useState, useContext } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import { useNotifStore } from '../store/notifStore'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)
  const addNotification = useNotifStore((s) => s.addNotification)

  useEffect(() => {
    if (!user) return
    const s = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token: localStorage.getItem('token') },
    })
    
    s.on('notification', (notif) => {
      addNotification(notif)
    })

    setSocket(s)
    return () => {
      s.off('notification')
      s.disconnect()
    }
  }, [user, addNotification])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => useContext(SocketContext)