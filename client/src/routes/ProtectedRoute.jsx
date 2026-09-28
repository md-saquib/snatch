import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'

// ─── ProtectedRoute ────────────────────────────────────────────────────────
// This component acts as a "guard" around protected pages.
// How it works:
// 1. It checks `isAuthenticated` from our AuthContext
// 2. If NOT authenticated → redirect to /login (no access)
// 3. If authenticated → render <Outlet /> which renders the child route's component
//
// Usage in AppRouter.jsx:
//   <Route element={<ProtectedRoute />}>
//     <Route path="/dashboard" element={<Dashboard />} />   ← protected
//   </Route>
const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    // `replace` prevents the user from going back to the protected page via browser back button
    return <Navigate to="/login" replace />
  }

  // `Outlet` renders whichever child route matched.
  // Think of it as a "slot" for the child component.
  return <Outlet />
}

export default ProtectedRoute
