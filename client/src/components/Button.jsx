import React from 'react'

// ─── Reusable Button component ────────────────────────────────────────────
// Centralizes loading state, disabled state, and variant styling.
const Button = ({
  children,
  loading = false,
  variant = 'primary', // 'primary' | 'danger' | 'secondary'
  className = '',
  ...props
}) => {
  const base = 'px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
    danger:  'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 focus:ring-indigo-500',
  }

  return (
    <button
      disabled={loading || props.disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {/* Show a spinner inside the button when loading */}
      {loading ? (
        <span className="flex items-center gap-2 justify-center">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          Loading...
        </span>
      ) : children}
    </button>
  )
}

export default Button
