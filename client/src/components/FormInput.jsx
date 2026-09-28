import React from 'react'

// ─── Reusable FormInput component ──────────────────────────────────────────
// Handles the label + input + error message pattern.
// Receives `error` from the parent (mapped from express-validator response)
// and renders it as a red helper text below the field.
const FormInput = ({
  label,
  id,
  error,        // string | undefined — the field-level error message
  className = '',
  ...props      // all other props (type, value, onChange, placeholder, etc.)
                // are spread directly onto the <input> element
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`
          w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors
          focus:ring-2 focus:ring-indigo-400 focus:border-transparent
          ${error
            ? 'border-red-400 bg-red-50 focus:ring-red-400'   // Error state styling
            : 'border-gray-300 bg-white'                       // Normal state
          }
          ${className}
        `}
        {...props}
      />
      {/* Only render the error paragraph if there IS an error */}
      {error && (
        <p className="text-xs text-red-600 mt-0.5">{error}</p>
      )}
    </div>
  )
}

export default FormInput
