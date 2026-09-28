import axiosInstance from '../../lib/axiosInstance'

// ─── AUTH API SERVICE ─────────────────────────────────────────────────────
// This file is ONLY responsible for making API calls.
// It has zero UI logic. Components/hooks call these functions
// and decide what to do with the results.

/**
 * Register a new user.
 * POST /api/auth/register
 * Body: { fullName, email, password }
 * On success: returns the created user (but NOT the accessToken — user must log in).
 * On 400: returns field-level errors from express-validator.
 */
export const registerApi = (formData) =>
  axiosInstance.post('/auth/register', formData)

/**
 * Log in an existing user.
 * POST /api/auth/login
 * Body: { email, password }
 * On success: returns { user, accessToken }.
 *   The server also sets the httpOnly refreshToken cookie automatically.
 * On 401: invalid credentials.
 */
export const loginApi = (credentials) =>
  axiosInstance.post('/auth/login', credentials)

/**
 * Log out the current user.
 * GET /api/auth/logout
 * Requires: Authorization header (handled by the request interceptor).
 * The server clears the httpOnly refreshToken cookie.
 */
export const logoutApi = () =>
  axiosInstance.get('/auth/logout')

/**
 * Hydrate the user — fetch the current logged-in user's profile.
 * GET /api/auth/me
 * Requires: Authorization header.
 * Useful on app load to verify the stored token is still valid.
 */
export const getMeApi = () =>
  axiosInstance.get('/auth/me')
