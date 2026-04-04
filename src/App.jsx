import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home            from './pages/landing/Home'
import Login           from './pages/auth/Login'
import Register        from './pages/auth/Register'
import ProblemList     from './pages/problems/ProblemList'
import ProblemDetail   from './pages/problems/ProblemDetail'
import PostProblem     from './pages/problems/PostProblem'
import ClientDashboard from './pages/dashboard/ClientDashboard'
import SolverDashboard from './pages/dashboard/SolverDashboard'
import ChatPage        from './pages/chat/ChatPage'
import PublicProfile   from './pages/profile/PublicProfile'
import AdminDashboard  from './pages/admin/AdminDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                  element={<Home />} />
        <Route path="/login"             element={<Login />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/problems"          element={<ProblemList />} />
        <Route path="/problems/:id"      element={<ProblemDetail />} />
        <Route path="/post-problem"      element={<PostProblem />} />
        <Route path="/dashboard/client"  element={<ClientDashboard />} />
        <Route path="/dashboard/solver"  element={<SolverDashboard />} />
        <Route path="/chat/:contractId"  element={<ChatPage />} />
        <Route path="/profile/:id"       element={<PublicProfile />} />
        <Route path="/admin"             element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}