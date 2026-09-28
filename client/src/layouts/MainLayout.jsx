import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

// MainLayout wraps all PROTECTED pages.
// It renders the Navbar at the top, then <Outlet /> renders
// whichever protected page matched (Dashboard, ProductDetail, etc.)
const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* py-8 px-4 adds consistent page padding */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
