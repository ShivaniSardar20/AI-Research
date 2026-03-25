import React, { createContext, useContext, useState, useEffect } from 'react'
import { login, signup, refreshToken } from '../utils/api'

const AuthContext = createContext()

const parseJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(normalized)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

const buildUserFromToken = (token) => {
  const payload = parseJwtPayload(token)
  if (!payload) {
    return { token, username: 'Research User' }
  }
  return {
    token,
    username: payload.username || payload.user_name || payload.sub || 'Research User',
    userId: payload.user_id || payload.sub || null,
  }
}

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      setUser(buildUserFromToken(token))
    }
    setLoading(false)
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const data = await login(credentials)
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      setUser(buildUserFromToken(data.access))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' }
    }
  }

  const handleSignup = async (userData) => {
    try {
      const data = await signup(userData)
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      setUser(buildUserFromToken(data.access))
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Signup failed' }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    setUser(null)
  }

  const refreshAccessToken = async () => {
    const refresh = localStorage.getItem('refresh_token')
    if (!refresh) return false
    try {
      const data = await refreshToken({ refresh })
      localStorage.setItem('access_token', data.access)
      setUser(buildUserFromToken(data.access))
      return true
    } catch {
      handleLogout()
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
        refreshToken: refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
