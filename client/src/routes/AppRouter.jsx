import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '../layouts/MainLayout'
import AuthLayout from '../layouts/AuthLayout'

// Lazy-load pages for better performance (code splitting)
// React.lazy + Suspense means the page bundle is only downloaded when needed
const LoginPage = React.lazy(() => import('../features/auth/components/LoginPage'))
const RegisterPage = React.lazy(() => import('../features/auth/components/RegisterPage'))
const Dashboard = React.lazy(() => import('../features/products/components/Dashboard'))
const ProductDetailPage = React.lazy(() => import('../features/products/components/ProductDetailPage'))
const ProductFormPage = React.lazy(() => import('../features/products/components/ProductFormPage'))

const AppRouter = () => {
  return (
    <BrowserRouter>
      {/* Suspense shows a fallback while the lazy component loads */}
      <React.Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
        </div>
      }>
        <Routes>

          {/* ── PUBLIC ROUTES (wrapped in AuthLayout) ── */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* ── PROTECTED ROUTES (inside MainLayout with Navbar) ── */}
          {/* ProtectedRoute checks auth; if OK, renders Outlet = MainLayout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              {/* `mode` prop: "create" or "edit" — reuses the same form component */}
              <Route path="/products/new" element={<ProductFormPage mode="create" />} />
              <Route path="/products/:id/edit" element={<ProductFormPage mode="edit" />} />
            </Route>
          </Route>

          {/* Default redirect: root "/" goes to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          {/* Catch-all for unknown routes */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </React.Suspense>
    </BrowserRouter>
  )
}

export default AppRouter
