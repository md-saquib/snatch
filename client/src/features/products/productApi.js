import axiosInstance from '../../lib/axiosInstance'

// ─── PRODUCT API SERVICE ───────────────────────────────────────────────────
// Separation of concerns: this file ONLY communicates with the backend.
// All business logic (loading states, error handling) lives in hooks.

/**
 * Fetch all products.
 * GET /api/product/allproducts
 * Public route — no auth required.
 */
export const getAllProductsApi = () =>
  axiosInstance.get('/product/allproducts')

/**
 * Fetch a single product by its MongoDB ObjectId.
 * GET /api/product/:id
 * Public route.
 */
export const getProductByIdApi = (id) =>
  axiosInstance.get(`/product/${id}`)

/**
 * Create a new product.
 * POST /api/product/createproduct
 * Protected route — requires Authorization header.
 * The body is FormData because the backend uses multer for image uploads.
 * We pass a custom Content-Type header to let axios set multipart/form-data
 * with the correct boundary automatically (do NOT set it manually).
 */
export const createProductApi = (formData) =>
  axiosInstance.post('/product/createproduct', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

/**
 * Update an existing product.
 * PATCH /api/product/updateproduct/:id
 * Protected route — requires Authorization header.
 * Also uses FormData for optional image replacement.
 */
export const updateProductApi = (id, formData) =>
  axiosInstance.patch(`/product/updateproduct/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

/**
 * Delete a product by ID.
 * DELETE /api/product/:id
 * Protected route — requires Authorization header.
 */
export const deleteProductApi = (id) =>
  axiosInstance.delete(`/product/${id}`)
