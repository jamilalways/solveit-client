import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import Spinner from './components/common/Spinner'

import Home             from './pages/landing/Home'
import Login            from './pages/auth/Login'
import Register         from './pages/auth/Register'
import ProblemList      from './pages/problems/ProblemList'
import ProblemDetail    from './pages/problems/ProblemDetail'
import PostProblem      from './pages/problems/PostProblem'
import ClientDashboard  from './pages/dashboard/ClientDashboard'
import SolverDashboard  from './pages/dashboard/SolverDashboard'
import ChatPage         from './pages/chat/ChatPage'
import PublicProfile    from './pages/profile/PublicProfile'
import AdminDashboard   from './pages/admin/AdminDashboard'

function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth()
  if (loading) return <Spinner />
  if (!user)   return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/"            element={<Home />} />
      <Route path="/login"       element={<Login />} />
      <Route path="/register"    element={<Register />} />
      <Route path="/problems"    element={<ProblemList />} />
      <Route path="/problems/:id"element={<ProblemDetail />} />
      <Route path="/profile/:id" element={<PublicProfile />} />

      {/* Client only */}
      <Route path="/dashboard/client" element={
        <PrivateRoute role="client"><ClientDashboard /></PrivateRoute>
      } />
      <Route path="/post-problem" element={
        <PrivateRoute role="client"><PostProblem /></PrivateRoute>
      } />

      {/* Solver only */}
      <Route path="/dashboard/solver" element={
        <PrivateRoute role="solver"><SolverDashboard /></PrivateRoute>
      } />

      {/* Shared authenticated */}
      <Route path="/chat/:contractId" element={
        <PrivateRoute><ChatPage /></PrivateRoute>
      } />

      {/* Admin only */}
      <Route path="/admin" element={
        <PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>
      } />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  )
}
