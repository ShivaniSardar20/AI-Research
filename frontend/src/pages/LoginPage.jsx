import React, { useState } from 'react'
import Alert from '@mui/material/Alert'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage({ setPage }) {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await login(form)
    setLoading(false)
    if (result.success) {
      setPage('dashboard')
    } else {
      setError(result.error)
    }
  }

  return (
    <div className="auth-card">
      <p className="auth-eyebrow">Member Access</p>
      <h2 className="auth-title">Login to continue your research workflow</h2>
      <p className="auth-copy">Access uploads, summaries, search, and chat from one workspace.</p>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <form onSubmit={handleSubmit} className="auth-form">
        <label className="auth-field">
          <span>Username</span>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
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
            placeholder="Enter your password"
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>
      </form>
      <button type="button" className="auth-switch" onClick={() => setPage('signup')}>
        Need an account? Create one
      </button>
    </div>
  )
}
