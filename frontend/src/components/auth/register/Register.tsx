import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../../../hooks/use-auth'
import { register } from '../../../services/auth-service'
import extractError from '../../../services/extract-error'
import { getUserHomePath } from '../../../services/auth-routing'
import SpinnerButton from '../../common/spinner-button/SpinnerButton'
import GoogleAuthButton from '../google-auth/GoogleAuthButton'
import './Register.css'

export default function Register() {
  const { user, saveSession } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (user) return <Navigate to={getUserHomePath(user)} replace />

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return

    setErrorMessage('')
    setLoading(true)

    try {
      const session = await register({
        ...form,
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim().toLowerCase()
      })
      saveSession(session.jwt, session.user)
      navigate(getUserHomePath(session.user), { replace: true })
    } catch (error) {
      const message = extractError(error)
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-card">
      <p className="eyebrow">Start your journey</p>
      <h1>Create account</h1>
      <p className="auth-intro">Join Voyanta and keep your favorite escapes in one place.</p>
      <form onSubmit={submit}>
        <label htmlFor="first-name">First name</label>
        <input id="first-name" autoComplete="given-name" minLength={2} value={form.firstName} onChange={event => setForm({ ...form, firstName: event.target.value })} required disabled={loading} />
        <label htmlFor="last-name">Last name</label>
        <input id="last-name" autoComplete="family-name" minLength={2} value={form.lastName} onChange={event => setForm({ ...form, lastName: event.target.value })} required disabled={loading} />
        <label htmlFor="register-email">Email</label>
        <input id="register-email" type="email" autoComplete="email" value={form.email} onChange={event => setForm({ ...form, email: event.target.value })} required disabled={loading} />
        <label htmlFor="register-password">Password</label>
        <input id="register-password" type="password" autoComplete="new-password" minLength={4} value={form.password} onChange={event => setForm({ ...form, password: event.target.value })} required disabled={loading} />
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        <SpinnerButton type="submit" loading={loading}>Create account</SpinnerButton>
      </form>
      <GoogleAuthButton />
      <p>Already a member? <Link to="/login">Login</Link></p>
    </section>
  )
}
