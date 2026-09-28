import React from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useProduct, useDeleteProduct } from '../useProducts'
import { useState } from 'react'
import ConfirmModal from '../../../components/ConfirmModal'
import Button from '../../../components/Button'

// ─── ProductDetailPage ─────────────────────────────────────────────────────
// Data flow:
// 1. useParams() extracts the `id` from the URL (e.g., /products/64abc...)
// 2. useProduct(id) fetches GET /api/product/:id
// 3. The fetched product is displayed; user can Edit or Delete from here
const ProductDetailPage = () => {
  const { id } = useParams()  // Extract :id from the route
  const { product, loading, error } = useProduct(id)
  const { handleDelete, loading: deleteLoading } = useDeleteProduct()
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  const confirmDelete = () => {
    handleDelete(id, () => navigate('/dashboard'))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">{error || 'Product not found.'}</p>
        <Link to="/dashboard" className="text-indigo-600 text-sm mt-4 inline-block">← Back to Dashboard</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back link */}
      <Link to="/dashboard" className="text-indigo-600 text-sm hover:underline inline-flex items-center gap-1 mb-6">
        ← Back to Dashboard
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Image gallery — show up to 5 images */}
        {product.images?.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 bg-gray-50">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.title} image ${i + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
            ))}
          </div>
        )}

        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{product.title}</h1>
              <p className="text-2xl font-extrabold text-indigo-700 mt-1">
                {product.price?.currency === 'INR' ? '₹' : '$'}
                {product.price?.amount?.toLocaleString()}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <Link to={`/products/${id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>
              <Button variant="danger" onClick={() => setShowModal(true)}>
                Delete
              </Button>
            </div>
          </div>

          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>

          {/* Size & Stock table */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Sizes & Stock</h3>
            <div className="flex flex-wrap gap-3">
              {product.sizes?.map((s) => (
                <div key={s.size} className="bg-indigo-50 rounded-lg px-4 py-2 text-center">
                  <p className="text-lg font-bold text-indigo-700">{s.size}</p>
                  <p className="text-xs text-gray-500">{s.stock} in stock</p>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-6">Product ID: {product._id}</p>
        </div>
      </div>

      <ConfirmModal
        isOpen={showModal}
        message={`Permanently delete "${product.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setShowModal(false)}
        loading={deleteLoading}
      />
    </div>
  )
}

export default ProductDetailPage
