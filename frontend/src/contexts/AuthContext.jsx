import React, { createContext, useContext, useState, useEffect } from 'react'
import { login, signup, refreshToken } from '../utils/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (token) {
      // Validate token or set user
      setUser({ token })
    }
    setLoading(false)
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const data = await login(credentials)
      localStorage.setItem('access_token', data.access)
      localStorage.setItem('refresh_token', data.refresh)
      setUser({ token: data.access })
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
      setUser({ token: data.access })
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
      setUser({ token: data.access })
      return true
    } catch (error) {
      handleLogout()
      return false
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login: handleLogin,
      signup: handleSignup,
      logout: handleLogout,
      refreshToken: refreshAccessToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}
