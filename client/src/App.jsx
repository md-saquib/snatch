import React from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './features/auth/AuthContext'
import AppRouter from './routes/AppRouter'

// ─── App.jsx ─────────────────────────────────────────────────────────────
// This is the root of the component tree. It sets up global providers:
//
// 1. <AuthProvider>  — Makes auth state (user, token, login/logout functions)
//                      available to every component via useAuth() hook
//
// 2. <AppRouter>     — Handles all routing (protected and public routes)
//                      This contains <BrowserRouter> inside it.
//
// 3. <Toaster>       — Global toast notification system from react-hot-toast.
//                      Any component can call `toast.success('...')` anywhere.

const App = () => {
  return (
    <AuthProvider>
      {/* Toaster renders toast notifications in the top-right corner */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            fontSize: '14px',
          },
        }}
      />
      <AppRouter />
    </AuthProvider>
  )
}

export default App
