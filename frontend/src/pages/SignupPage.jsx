import React, { useState } from 'react'
import Alert from '@mui/material/Alert'
import { useAuth } from '../contexts/AuthContext'

export default function SignupPage({ setPage }) {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    const result = await signup({
      username: form.username,
      email: form.email,
      password: form.password,
    })
    setLoading(false)
    if (result.success) {
      setPage('dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="auth-card">
      <p className="auth-eyebrow">Create Account</p>
      <h2 className="auth-title">Start a persistent AI research workspace</h2>
      <p className="auth-copy">Create an account to manage papers and keep your analysis history in one place.</p>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-field">
          <span>Username</span>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
          />
        </label>
        <label className="auth-field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
          />
        </label>
        <label className="auth-field">
          <span>Password</span>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />
        </label>
        <label className="auth-field">
          <span>Confirm Password</span>
          <input
            name="confirmPassword"
            type="password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      <button type="button" className="auth-switch" onClick={() => setPage('login')}>
        Already have an account? Login
      </button>
    </div>
  )
}
