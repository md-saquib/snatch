import React from 'react'
import { Outlet } from 'react-router-dom'

// AuthLayout wraps public pages (Login, Register).
// Centered card layout — no Navbar needed.
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* App branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-indigo-700 tracking-tight">
            Snatch
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Your modern e-commerce platform</p>
        </div>
        {/* The actual Login or Register form renders here */}
        <Outlet />
      </div>
    </div>
  )
}

export default AuthLayout
