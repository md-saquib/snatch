import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FormInput from '../../../components/FormInput'
import Button from '../../../components/Button'
import { useLogin } from '../useAuth'

// ─── LoginPage ─────────────────────────────────────────────────────────────
// This component is PURELY presentational:
// - It owns the local form state (email, password)
// - It delegates ALL logic to `useLogin()` hook
// Data flow: User types → local state → handleLogin(formData) → hook → API → context
const LoginPage = () => {
  // Local form state — only this component needs it
  const [formData, setFormData] = useState({ email: '', password: '' })

  // Destructure everything we need from the hook
  const { handleLogin, loading, fieldErrors } = useLogin()

  // Generic onChange handler — updates the matching key in formData
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault() // Prevent browser default form submission
    handleLogin(formData) // Hand off to hook; hook calls the API
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h2>
      <p className="text-sm text-gray-500 mb-6">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* `error={fieldErrors.email}` passes the server validation error
            for this specific field. FormInput renders it as red helper text. */}
        <FormInput
          label="Email address"
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={fieldErrors.email}
          required
          autoFocus
        />

        <FormInput
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          required
        />

        <Button type="submit" loading={loading} className="w-full mt-2">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}

export default LoginPage
