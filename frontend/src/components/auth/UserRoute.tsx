import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/use-auth'

export default function UserRoute() {
  const { jwt, user, isReady } = useAuth()
  if (!isReady) return <div className="loading">Loading your account...</div>
  if (!jwt || !user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/admin/vacations" replace />
  return <Outlet />
}
