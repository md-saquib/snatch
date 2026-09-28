import React, { createContext, useContext, useState, useCallback } from 'react'

// ─── 1. CREATE THE CONTEXT ─────────────────────────────────────────────────
// A Context is like a "global store" for a specific slice of state.
// Any component inside <AuthProvider> can read from it without prop-drilling.
const AuthContext = createContext(null)

// ─── 2. PROVIDER COMPONENT ────────────────────────────────────────────────
// This component wraps our entire app (in App.jsx).
// It holds the auth state and exposes functions to update it.
export const AuthProvider = ({ children }) => {

  // Initialize state from localStorage so the user stays logged in
  // even after a page refresh (persistent login).
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('user')
      return storedUser ? JSON.parse(storedUser) : null
    } catch {
      return null
    }
  })

  const [accessToken, setAccessToken] = useState(
    () => localStorage.getItem('accessToken') || null
  )

  // `isAuthenticated` is a derived boolean — true if we have both user and token
  const isAuthenticated = !!user && !!accessToken

  // Called after a successful login or register API response
  const login = useCallback((userData, token) => {
    // Persist to localStorage so state survives page refresh
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('accessToken', token)
    // Update React state so the UI re-renders immediately
    setUser(userData)
    setAccessToken(token)
  }, [])

  // Called on logout or when the refresh token is invalid
  const logout = useCallback(() => {
    localStorage.removeItem('user')
    localStorage.removeItem('accessToken')
    setUser(null)
    setAccessToken(null)
  }, [])

  // The value object is what all consumer components can access
  const value = { user, accessToken, isAuthenticated, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── 3. CUSTOM HOOK ──────────────────────────────────────────────────────
// `useAuth()` is a convenience hook. Instead of writing:
//   const { user } = useContext(AuthContext)
// Any component can just write:
//   const { user } = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>')
  }
  return context
}
