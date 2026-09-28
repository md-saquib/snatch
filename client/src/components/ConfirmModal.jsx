import React from 'react'

// ─── ConfirmModal ─────────────────────────────────────────────────────────
// A simple confirmation dialog for destructive actions (like delete).
// The parent controls visibility via `isOpen`.
const ConfirmModal = ({ isOpen, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null // Render nothing when closed

  return (
    // Backdrop: semi-transparent overlay
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onCancel} // Clicking outside the modal cancels it
    >
      {/* Modal card — stopPropagation prevents the backdrop click from firing */}
      <div
        className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-800 mb-2">Are you sure?</h2>
        <p className="text-sm text-gray-600 mb-6">
          {message || 'This action cannot be undone.'}
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
