import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <section className="panel center not-found">
      <h1>Page not found</h1>
      <p>The page you tried to open does not exist.</p>
      <Link className="button-link" to="/about">Back home</Link>
    </section>
  )
}
