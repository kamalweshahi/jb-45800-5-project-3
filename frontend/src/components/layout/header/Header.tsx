import { Compass, LogOut, PlaneTakeoff } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/use-auth'
import './Header.css'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function logoutAndGoHome() {
    logout()
    navigate('/login')
  }

  return (
    <header className="Header">
      <NavLink to="/about" className="brand" aria-label="Voyanta home">
        <PlaneTakeoff size={24} />
        <span>Voyanta</span>
      </NavLink>

      <nav aria-label="Main navigation">
        <NavLink to="/about">About</NavLink>
        {!user && <NavLink to="/login">Login</NavLink>}
        {!user && <NavLink to="/register">Register</NavLink>}
        {user?.role === 'user' && <NavLink to="/vacations">Vacations</NavLink>}
        {user?.role === 'admin' && <NavLink to="/admin/vacations">Manage Vacations</NavLink>}
        {user && <NavLink to="/ai">AI Planner</NavLink>}
        {user && <NavLink to="/mcp">Travel Data</NavLink>}
        {user?.role === 'admin' && <NavLink to="/admin/vacations/new">Add Vacation</NavLink>}
        {user?.role === 'admin' && <NavLink to="/admin/reports">Reports</NavLink>}
      </nav>

      {user ? (
        <div className="user-area">
          <span><Compass size={17} /> {user.firstName} {user.lastName}{user.role === 'admin' && <small className="role-badge">Admin</small>}</span>
          <button onClick={logoutAndGoHome} aria-label="Logout"><LogOut size={17} /> Logout</button>
        </div>
      ) : <div className="header-spacer" />}
    </header>
  )
}
