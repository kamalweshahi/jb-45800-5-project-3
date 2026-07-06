import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAuth from '../../../hooks/use-auth'
import { login } from '../../../services/auth-service'
import extractError from '../../../services/extract-error'
import { getUserHomePath } from '../../../services/auth-routing'
import SpinnerButton from '../../common/spinner-button/SpinnerButton'
import GoogleAuthButton from '../google-auth/GoogleAuthButton'
import './Login.css'

export default function Login() {
  const { user, saveSession } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (user) return <Navigate to={getUserHomePath(user)} replace />

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (loading) return

    setErrorMessage('')
    setLoading(true)

    try {
      const session = await login({ email: email.trim().toLowerCase(), password })
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
      <p className="eyebrow">Welcome back</p>
      <h1>Login</h1>
      <p className="auth-intro">Sign in to save trips, plan itineraries, and keep exploring.</p>
      <form onSubmit={submit} noValidate={false}>
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required disabled={loading} />
        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" autoComplete="current-password" minLength={4} value={password} onChange={event => setPassword(event.target.value)} required disabled={loading} />
        {errorMessage && <p className="form-error" role="alert">{errorMessage}</p>}
        <SpinnerButton type="submit" loading={loading}>Login</SpinnerButton>
      </form>
      <GoogleAuthButton />
      <p>Don&apos;t have an account? <Link to="/register">Register now</Link></p>
    </section>
  )
}
