import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct, getCategories, IMAGE_BASE } from '../../services/api.js'
import Thumb from '../../components/user/Thumb.jsx'

const imageUrl = (path) =>
  path && path !== 'null' ? IMAGE_BASE + '/' + path : ''

const formatPrice = (price) =>
  typeof price === 'number' ? 'Rs. ' + price : 'Rs. ' + price

export default function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [prodRes, catRes] = await Promise.allSettled([getProduct(id), getCategories()])
        if (cancelled) return
        if (prodRes.status === 'fulfilled') {
          setProduct(prodRes.value.data.data)
        } else {
          setError(prodRes.reason?.response?.status === 404 ? 'Product not found.' : 'Failed to load product.')
        }
        if (catRes.status === 'fulfilled') {
          setCategories((catRes.value.data.data || []).filter((c) => c.isActive !== false))
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    window.scrollTo({ top: 0 })
    return () => { cancelled = true }
  }, [id])

  const categoryName = () => {
    if (!product?.category) return null
    if (typeof product.category === 'object') return product.category.name
    const found = categories.find(c => c._id === product.category)
    return found?.name || null
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-10 animate-pulse">
          <div className="aspect-square rounded-2xl bg-orange-100/60" />
          <div>
            <div className="h-8 w-3/4 rounded bg-orange-100/60" />
            <div className="mt-4 h-6 w-1/4 rounded bg-orange-100/60" />
            <div className="mt-6 h-28 w-full rounded bg-orange-100/60" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Product not found</h1>
        <p className="text-slate-600 mb-6">{error || 'This product may not exist.'}</p>
        <Link to="/" className="px-6 py-2.5 bg-brand text-white rounded-full hover:bg-brand-dark">Back to Menu</Link>
      </div>
    )
  }

  const catName = categoryName()

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <nav className="mb-8 text-sm text-slate-500 flex items-center gap-2">
        <Link to="/" className="hover:text-brand">Home</Link>
        <span>/</span>
        {catName && (
          <>
            <span className="text-slate-600">{catName}</span>
            <span>/</span>
          </>
        )}
        <span className="text-slate-900">{product.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
        <div className="rounded-2xl overflow-hidden shadow-lg border border-orange-100/60">
          {product.image ? (
            <Thumb src={imageUrl(product.image)} alt={product.name} className="w-full aspect-square object-cover" />
          ) : (
            <div className="w-full aspect-square flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
              <span className="material-symbols-outlined text-7xl text-brand">fastfood</span>
            </div>
          )}
        </div>

        <div>
          {catName && (
            <span className="inline-block px-3 py-1 bg-orange-50 text-brand text-xs rounded-full mb-4">
              {catName}
            </span>
          )}
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 mb-3">{product.name}</h1>
          <p className="text-2xl md:text-3xl font-bold text-brand mb-8">{formatPrice(product.price)}</p>
          
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-3">Description</h2>
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {product.description || 'Freshly prepared with quality ingredients.'}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => e.preventDefault()}
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white rounded-full hover:bg-brand-dark transition-colors cursor-not-allowed opacity-80"
            title="Not available"
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            Add to Cart
          </button>

          <Link to="/menu" className="inline-flex items-center gap-2 text-brand hover:text-brand-dark font-medium mt-4">
            <span className="material-symbols-outlined text-lg">arrow_back</span>
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  )
}
