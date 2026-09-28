import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/AuthContext'
import { useLogout } from '../features/auth/useAuth'

// ─── Navbar ────────────────────────────────────────────────────────────────
// Shared UI component — knows about auth state but delegates
// logout logic to the `useLogout` hook (separation of concerns).
const Navbar = () => {
  const { user } = useAuth()
  const { handleLogout, loading } = useLogout()

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand / Logo */}
          <Link to="/dashboard" className="text-2xl font-extrabold text-indigo-700">
            Snatch
          </Link>

          {/* Right side: user greeting + actions */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              Hi, <span className="font-semibold text-gray-800">{user?.fullName || 'User'}</span>
            </span>

            <Link
              to="/products/new"
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              + Add Product
            </Link>

            <button
              onClick={handleLogout}
              disabled={loading}
              className="text-sm text-gray-500 hover:text-red-600 font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
