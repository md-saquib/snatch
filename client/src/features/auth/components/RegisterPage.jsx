import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FormInput from '../../../components/FormInput'
import Button from '../../../components/Button'
import { useRegister } from '../useAuth'

// ─── RegisterPage ──────────────────────────────────────────────────────────
// Data flow: User types → local state → handleRegister() → hook → API
// On 400: hook maps express-validator errors → fieldErrors → inline display
const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [clientError, setClientError] = useState('')

  const { handleRegister, loading, fieldErrors } = useRegister()

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setClientError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Client-side only validation for confirmPassword
    // (Backend doesn't have a confirmPassword field, so we validate it here)
    if (formData.password !== formData.confirmPassword) {
      setClientError('Passwords do not match.')
      return
    }

    // We don't send confirmPassword to the backend — it doesn't need it
    const { confirmPassword, ...payload } = formData
    handleRegister(payload)
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Create account</h2>
      <p className="text-sm text-gray-500 mb-6">Join Snatch today — it's free</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Each FormInput receives its specific field error from fieldErrors map */}
        <FormInput
          label="Full Name"
          id="fullName"
          name="fullName"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          error={fieldErrors.fullName}   // 'fullName' matches the express-validator `path`
          required
          autoFocus
        />

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
        />

        <FormInput
          label="Password"
          id="password"
          name="password"
          type="password"
          placeholder="Min. 6 characters"
          value={formData.password}
          onChange={handleChange}
          error={fieldErrors.password}
          required
        />

        <FormInput
          label="Confirm Password"
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          placeholder="Repeat your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={clientError} // This is our client-side match error
          required
        />

        <Button type="submit" loading={loading} className="w-full mt-2">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-indigo-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

export default RegisterPage
