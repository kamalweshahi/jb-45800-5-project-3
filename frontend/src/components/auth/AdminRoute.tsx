import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../hooks/use-auth'

export default function AdminRoute() {
  const { jwt, user, isReady } = useAuth()
  if (!isReady) return <div className="loading">Checking administrator access...</div>
  if (!jwt || !user) return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/vacations" replace />
  return <Outlet />
}
