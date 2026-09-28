import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useProducts, useDeleteProduct } from '../useProducts'
import ConfirmModal from '../../../components/ConfirmModal'
import Button from '../../../components/Button'

// ─── ProductCard (internal sub-component) ─────────────────────────────────
// Renders a single product card. Kept here since it's only used in Dashboard.
const ProductCard = ({ product, onDeleteClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="h-48 bg-gray-100 overflow-hidden">
        {product.images?.[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            No image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-800 truncate">{product.title}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>

        {/* Price */}
        <p className="text-indigo-700 font-bold mt-2 text-lg">
          {product.price?.currency === 'INR' ? '₹' : '$'}
          {product.price?.amount?.toLocaleString()}
        </p>

        {/* Size badges */}
        <div className="flex flex-wrap gap-1 mt-2">
          {product.sizes?.map((s) => (
            <span key={s.size} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
              {s.size} ({s.stock})
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <Link
            to={`/products/${product._id}`}
            className="flex-1 text-center text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg transition-colors border border-gray-200"
          >
            View
          </Link>
          <Link
            to={`/products/${product._id}/edit`}
            className="flex-1 text-center text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-2 rounded-lg transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={() => onDeleteClick(product)}
            className="text-sm bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
// Data flow:
// 1. `useProducts()` fetches GET /api/product/allproducts on mount
// 2. User clicks Delete → modal opens (state = which product to delete)
// 3. User confirms → `handleDelete(id)` → DELETE /api/product/:id
// 4. On success, `refetch()` re-fetches the product list to update the UI
const Dashboard = () => {
  const { products, loading, error, refetch } = useProducts()
  const { handleDelete, loading: deleteLoading } = useDeleteProduct()

  // Modal state: null = closed, or the product object to be deleted
  const [productToDelete, setProductToDelete] = useState(null)

  const confirmDelete = () => {
    handleDelete(productToDelete._id, () => {
      setProductToDelete(null) // Close the modal
      refetch()                // Refresh the list
    })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-16">{error}</div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Product Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">{products.length} products total</p>
        </div>
        <Link to="/products/new">
          <Button>+ New Product</Button>
        </Link>
      </div>

      {/* Empty state */}
      {products.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-lg font-medium">No products yet.</p>
          <p className="text-sm mt-1">Click "New Product" to add your first one.</p>
        </div>
      ) : (
        // Product grid — responsive: 1 col mobile, 2 tablet, 3 desktop
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDeleteClick={(p) => setProductToDelete(p)} // Open modal with this product
            />
          ))}
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={!!productToDelete}
        message={`Delete "${productToDelete?.title}"? This cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setProductToDelete(null)}
        loading={deleteLoading}
      />
    </div>
  )
}

export default Dashboard
