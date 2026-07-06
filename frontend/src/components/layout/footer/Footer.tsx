import { Link } from 'react-router-dom'
import useAuth from '../../../hooks/use-auth'
import './Footer.css'

export default function Footer() {
  const { user } = useAuth()
  const vacationsPath = user?.role === 'admin' ? '/admin/vacations' : '/vacations'

  return (
    <footer className="Footer">
      <div className="footer-brand">
        <Link to="/about" className="brand">Voyanta</Link>
        <p>Discover remarkable places. Plan with confidence. Travel your way.</p>
      </div>
      <div className="footer-links" aria-label="Footer navigation">
        <Link to="/about">About</Link>
        {user && <Link to={vacationsPath}>{user.role === 'admin' ? 'Manage vacations' : 'Vacations'}</Link>}
        {user && <Link to="/ai">AI Planner</Link>}
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} Voyanta. All rights reserved.</p>
    </footer>
  )
}
