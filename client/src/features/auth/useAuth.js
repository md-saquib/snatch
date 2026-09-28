import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from './AuthContext'
import { loginApi, registerApi, logoutApi } from './authApi'

// ─── useLogin HOOK ─────────────────────────────────────────────────────────
// Custom hooks contain ALL the business logic for a feature.
// The UI component just calls `handleLogin(formData)` and reads
// `loading` / `errors` — it has no idea how the API works.
export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  // `fieldErrors` maps field names to error messages for inline form display
  const [fieldErrors, setFieldErrors] = useState({})
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (formData) => {
    setLoading(true)
    setFieldErrors({})

    try {
      // Call the API service → axios sends POST /api/auth/login
      const { data } = await loginApi(formData)

      // On success, `data.data` contains { user, accessToken }
      // We call the context's `login()` to save state + localStorage
      login(data.data.user, data.data.accessToken)

      toast.success('Welcome back! 🎉')
      navigate('/dashboard') // Redirect to protected route

    } catch (error) {
      const status = error.response?.status
      const serverMessage = error.response?.data?.message

      if (status === 401 || status === 404) {
        // Credential error — show a generic toast
        toast.error(serverMessage || 'Invalid email or password')
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return { handleLogin, loading, fieldErrors }
}

// ─── useRegister HOOK ──────────────────────────────────────────────────────
export const useRegister = () => {
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const navigate = useNavigate()

  const handleRegister = async (formData) => {
    setLoading(true)
    setFieldErrors({})

    try {
      await registerApi(formData)
      toast.success('Account created! Please log in.')
      navigate('/login')

    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data

      if (status === 400) {
        // express-validator returns: { errors: [{ path: 'email', msg: '...' }] }
        if (responseData?.errors && Array.isArray(responseData.errors)) {
          // Convert the array into a { fieldName: errorMessage } object
          // so each form field can display its own error message inline
          const mapped = {}
          responseData.errors.forEach(({ path, msg }) => {
            mapped[path] = msg
          })
          setFieldErrors(mapped)
        } else {
          // Generic 400 (e.g., "User already exists")
          toast.error(responseData?.message || 'Registration failed.')
        }
      } else {
        toast.error('Something went wrong. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return { handleRegister, loading, fieldErrors }
}

// ─── useLogout HOOK ───────────────────────────────────────────────────────
export const useLogout = () => {
  const [loading, setLoading] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    setLoading(true)
    try {
      // Tell the server to clear the httpOnly refreshToken cookie
      await logoutApi()
    } catch {
      // Even if the API call fails (e.g., network error),
      // we still clear the client-side state to log the user out locally
    } finally {
      logout()             // Clears localStorage + React state
      toast.success('Logged out successfully.')
      navigate('/login')
      setLoading(false)
    }
  }

  return { handleLogout, loading }
}
