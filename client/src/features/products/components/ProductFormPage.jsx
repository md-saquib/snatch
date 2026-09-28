import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCreateProduct, useUpdateProduct, useProduct } from '../useProducts'
import FormInput from '../../../components/FormInput'
import Button from '../../../components/Button'

// ─── SIZE OPTIONS ──────────────────────────────────────────────────────────
const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL']

// ─── ProductFormPage ────────────────────────────────────────────────────────
// This single component handles BOTH Create and Edit because the forms
// are nearly identical. The `mode` prop ("create" | "edit") controls behavior.
//
// Data flow (Create):
//   User fills form → handleSubmit → buildFormData() → createProductApi() →
//   multipart POST /api/product/createproduct → redirect to Dashboard
//
// Data flow (Edit):
//   useProduct(id) fetches existing data → pre-fills form →
//   User edits → handleSubmit → buildFormData() → updateProductApi() →
//   PATCH /api/product/updateproduct/:id → redirect to product detail
const ProductFormPage = ({ mode }) => {
  const { id } = useParams() // Only defined in "edit" mode
  const navigate = useNavigate()
  const isEdit = mode === 'edit'

  // Fetch existing product data when in edit mode
  const { product: existingProduct, loading: productLoading } = useProduct(isEdit ? id : null)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [currency, setCurrency] = useState('INR')
  const [amount, setAmount] = useState('')
  // sizes is an array of { size, stock } objects matching the backend schema
  const [sizes, setSizes] = useState([{ size: 'M', stock: '' }])
  // images: FileList from the file picker
  const [imageFiles, setImageFiles] = useState([])
  // Preview URLs for selected images (so user sees thumbnails before upload)
  const [imagePreviews, setImagePreviews] = useState([])

  const { handleCreate, loading: createLoading, fieldErrors: createErrors } = useCreateProduct()
  const { handleUpdate, loading: updateLoading, fieldErrors: updateErrors } = useUpdateProduct()

  const loading = isEdit ? updateLoading : createLoading
  const fieldErrors = isEdit ? updateErrors : createErrors

  // ── Pre-fill form when editing ────────────────────────────────────────
  // When `existingProduct` arrives (async), populate the form fields.
  // This runs whenever existingProduct changes (i.e., after the API call).
  useEffect(() => {
    if (isEdit && existingProduct) {
      setTitle(existingProduct.title || '')
      setDescription(existingProduct.description || '')
      setCurrency(existingProduct.price?.currency || 'INR')
      setAmount(existingProduct.price?.amount || '')
      setSizes(existingProduct.sizes?.length > 0
        ? existingProduct.sizes.map(s => ({ size: s.size, stock: s.stock }))
        : [{ size: 'M', stock: '' }]
      )
      // Show existing images as previews (URLs from ImageKit)
      setImagePreviews(existingProduct.images || [])
    }
  }, [existingProduct, isEdit])

  // ── Size row handlers ──────────────────────────────────────────────────
  const addSizeRow = () => setSizes([...sizes, { size: 'S', stock: '' }])

  const removeSizeRow = (index) => setSizes(sizes.filter((_, i) => i !== index))

  const handleSizeChange = (index, field, value) => {
    const updated = [...sizes]
    updated[index] = { ...updated[index], [field]: value }
    setSizes(updated)
  }

  // ── Image picker handler ───────────────────────────────────────────────
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    setImageFiles(files)
    // Generate temporary blob URLs for preview (revoke them on unmount in production)
    setImagePreviews(files.map((f) => URL.createObjectURL(f)))
  }

  // ── Build FormData ─────────────────────────────────────────────────────
  // The backend uses multer for file uploads, so we MUST use multipart/form-data.
  //
  // WHY JSON.stringify for sizes and price:
  // The backend's `parseStringIntoNumberDuringApiCall` middleware does:
  //   req.body.sizes = JSON.parse(req.body.sizes)
  //   req.body.price = JSON.parse(req.body.price)
  //
  // This means it EXPECTS those fields to arrive as raw JSON strings.
  // If we used bracket notation (sizes[0][size], sizes[0][stock]), multer would
  // auto-parse them into a JS Array/Object BEFORE the middleware runs —
  // then JSON.parse(Array) throws "Cannot convert object to primitive value".
  //
  // Solution: serialize to a JSON string on the frontend so the middleware
  // can safely JSON.parse() it back into the right shape.
  const buildFormData = () => {
    const fd = new FormData()
    fd.append('title', title)
    fd.append('description', description)

    // Serialize price object as a JSON string — the middleware will parse it back
    fd.append('price', JSON.stringify({ currency, amount: Number(amount) }))

    // Serialize sizes array as a JSON string — each stock value cast to Number
    // so the backend validator's isInt() check passes correctly
    fd.append('sizes', JSON.stringify(
      sizes.map(s => ({ size: s.size, stock: Number(s.stock) }))
    ))

    // Append all image files under the key 'images' (matches upload.array('images'))
    imageFiles.forEach((file) => fd.append('images', file))

    return fd
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const fd = buildFormData()

    if (isEdit) {
      handleUpdate(id, fd, () => navigate(`/products/${id}`))
    } else {
      handleCreate(fd, () => navigate('/dashboard'))
    }
  }

  if (isEdit && productLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Link to={isEdit ? `/products/${id}` : '/dashboard'} className="text-indigo-600 text-sm hover:underline mb-6 inline-block">
        ← {isEdit ? 'Back to Product' : 'Back to Dashboard'}
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

          {/* ── Basic Info ── */}
          <FormInput
            label="Product Title"
            id="title"
            type="text"
            placeholder="e.g. Classic Cotton T-Shirt"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={fieldErrors.title}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={4}
              placeholder="Describe your product (min 10 characters)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none transition-colors focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none
                ${fieldErrors.description ? 'border-red-400 bg-red-50' : 'border-gray-300'}`}
              required
            />
            {fieldErrors.description && (
              <p className="text-xs text-red-600">{fieldErrors.description}</p>
            )}
          </div>

          {/* ── Price ── */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">Price</label>
            <div className="flex gap-3">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
              </select>
              <FormInput
                id="amount"
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                error={fieldErrors['price.amount']}
                min={1}
                required
                className="flex-1"
              />
            </div>
          </div>

          {/* ── Sizes ── */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Sizes & Stock
            </label>
            <div className="flex flex-col gap-2">
              {sizes.map((s, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <select
                    value={s.size}
                    onChange={(e) => handleSizeChange(i, 'size', e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                  >
                    {SIZE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    placeholder="Stock qty"
                    value={s.stock}
                    onChange={(e) => handleSizeChange(i, 'stock', e.target.value)}
                    min={1}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 outline-none"
                    required
                  />
                  {/* Don't allow removing the last size row */}
                  {sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSizeRow(i)}
                      className="text-red-500 hover:text-red-700 text-lg leading-none"
                      title="Remove this size"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addSizeRow}
                className="text-sm text-indigo-600 hover:underline text-left mt-1"
              >
                + Add another size
              </button>
            </div>
          </div>

          {/* ── Images ── */}
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-2">
              Product Images {isEdit && <span className="text-gray-400 font-normal">(upload to replace existing)</span>}
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {/* Image thumbnails preview */}
            {imagePreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {imagePreviews.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`preview-${i}`}
                    className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            )}
          </div>

          {/* ── Submit ── */}
          <div className="flex gap-3 pt-2">
            <Button type="submit" loading={loading} className="flex-1">
              {isEdit ? 'Save Changes' : 'Create Product'}
            </Button>
            <Link to={isEdit ? `/products/${id}` : '/dashboard'} className="flex-1">
              <Button type="button" variant="secondary" className="w-full">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormPage
