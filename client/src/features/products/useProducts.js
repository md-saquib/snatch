import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  getAllProductsApi,
  getProductByIdApi,
  createProductApi,
  updateProductApi,
  deleteProductApi,
} from './productApi'

// ─── useProducts HOOK ─────────────────────────────────────────────────────
// Fetches the full product list. Used by the Dashboard.
export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const { data } = await getAllProductsApi()
      // data.data is the array of products returned by the backend
      setProducts(data.data || [])
    } catch {
      setError('Failed to load products.')
      toast.error('Failed to load products.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Run on mount — this is the "on page load, fetch data" pattern
  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Return `refetch` so the Dashboard can trigger a refresh after delete/create
  return { products, loading, error, refetch: fetchProducts }
}

// ─── useProduct HOOK (single product) ─────────────────────────────────────
// Fetches a single product by ID. Used by the ProductDetail page.
export const useProduct = (id) => {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return

    const fetchProduct = async () => {
      setLoading(true)
      try {
        const { data } = await getProductByIdApi(id)
        setProduct(data.data)
      } catch {
        setError('Product not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [id]) // Re-fetch whenever the ID changes (e.g., navigating between products)

  return { product, loading, error }
}

// ─── useCreateProduct HOOK ─────────────────────────────────────────────────
export const useCreateProduct = () => {
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  // `onSuccess` is a callback prop — the UI tells this hook what to do after success
  const handleCreate = async (formData, onSuccess) => {
    setLoading(true)
    setFieldErrors({})
    try {
      const { data } = await createProductApi(formData)
      toast.success('Product created successfully! 🚀')
      onSuccess?.(data.data) // Pass the new product back to the caller
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data

      if (status === 400 && responseData?.error && Array.isArray(responseData.error)) {
        // Map express-validator errors to field-keyed object
        const mapped = {}
        responseData.error.forEach(({ path, msg }) => {
          mapped[path] = msg
        })
        setFieldErrors(mapped)
      } else {
        toast.error(responseData?.message || 'Failed to create product.')
      }
    } finally {
      setLoading(false)
    }
  }

  return { handleCreate, loading, fieldErrors }
}

// ─── useUpdateProduct HOOK ─────────────────────────────────────────────────
export const useUpdateProduct = () => {
  const [loading, setLoading] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})

  const handleUpdate = async (id, formData, onSuccess) => {
    setLoading(true)
    setFieldErrors({})
    try {
      const { data } = await updateProductApi(id, formData)
      toast.success('Product updated! ✅')
      onSuccess?.(data.data)
    } catch (error) {
      const status = error.response?.status
      const responseData = error.response?.data

      if (status === 400 && responseData?.error && Array.isArray(responseData.error)) {
        const mapped = {}
        responseData.error.forEach(({ path, msg }) => {
          mapped[path] = msg
        })
        setFieldErrors(mapped)
      } else {
        toast.error(responseData?.message || 'Failed to update product.')
      }
    } finally {
      setLoading(false)
    }
  }

  return { handleUpdate, loading, fieldErrors }
}

// ─── useDeleteProduct HOOK ─────────────────────────────────────────────────
export const useDeleteProduct = () => {
  const [loading, setLoading] = useState(false)

  const handleDelete = async (id, onSuccess) => {
    setLoading(true)
    try {
      await deleteProductApi(id)
      toast.success('Product deleted.')
      onSuccess?.() // Tell the Dashboard to refetch the product list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product.')
    } finally {
      setLoading(false)
    }
  }

  return { handleDelete, loading }
}
