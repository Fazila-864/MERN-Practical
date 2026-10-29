import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, getProducts, IMAGE_BASE } from '../../services/api.js'
import Thumb from '../../components/user/Thumb.jsx'

const imageUrl = (path) =>
  path && path !== 'null' ? IMAGE_BASE + '/' + path : ''

const formatPrice = (price) =>
  typeof price === 'number' ? 'Rs. ' + price : 'Rs. ' + price

function SkeletonGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-2xl bg-orange-100/60" />
          <div className="mt-4 h-4 w-2/3 rounded bg-orange-100/60" />
          <div className="mt-2 h-3 w-1/3 rounded bg-orange-100/60" />
        </div>
      ))}
    </div>
  )
}

export default function Menu() {
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const [catRes, prodRes] = await Promise.allSettled([
          getCategories(),
          getProducts(),
        ])
        if (cancelled) return
        if (catRes.status === 'fulfilled') {
          setCategories((catRes.value.data.data || []).filter((c) => c.isActive !== false))
        }
        if (prodRes.status === 'fulfilled') {
          setProducts((prodRes.value.data.data || []).filter((p) => p.isActive !== false))
        }
        if (catRes.status === 'rejected' && prodRes.status === 'rejected') {
          setError('Could not load products. Make sure backend is running on http://localhost:4000')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const categoryIdOf = (product) =>
    product.category && typeof product.category === 'object'
      ? product.category._id
      : product.category

  const visibleProducts = useMemo(
    () =>
      activeCategory === 'all'
        ? products
        : products.filter((p) => categoryIdOf(p) === activeCategory),
    [products, activeCategory]
  )

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1600&h=700&fit=crop"
            alt="Menu"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-14 md:py-18">
          <nav className="mb-4 text-sm text-white/70 flex items-center gap-2">
            <Link to="/" className="hover:text-gold">Home</Link>
            <span>/</span>
            <span className="text-white">Menu</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-2">Our Menu</h1>
          <p className="text-white/90">Discover all our delicious dishes</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-slate-900 mb-6">Browse by Category</h2>
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setActiveCategory('all')}
              className={'flex items-center gap-3 px-4 py-2 rounded-full transition-all ' + (activeCategory === 'all' ? 'bg-brand text-white shadow-md' : 'bg-white border border-orange-100 text-slate-700 hover:shadow-md')}
            >
              <div className={'w-10 h-10 rounded-full flex items-center justify-center ' + (activeCategory === 'all' ? 'bg-white/20' : 'bg-orange-50')}>
                <span className="material-symbols-outlined text-lg">restaurant_menu</span>
              </div>
              <span className="text-sm font-medium">All</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setActiveCategory(cat._id)}
                className={'flex items-center gap-3 px-4 py-2 rounded-full transition-all ' + (activeCategory === cat._id ? 'bg-brand text-white shadow-md' : 'bg-white border border-orange-100 text-slate-700 hover:shadow-md')}
              >
                <div className={'w-10 h-10 rounded-full overflow-hidden ' + (activeCategory === cat._id ? '' : 'bg-orange-50')}>
                  {cat.image ? (
                    <Thumb
                      src={imageUrl(cat.image)}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-lg">fastfood</span>
                    </div>
                  )}
                </div>
                <span className="text-sm font-medium">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="text-center py-16 text-red-600">{error}</div>
        ) : loading ? (
          <SkeletonGrid />
        ) : visibleProducts.length === 0 ? (
          <div className="text-center py-16 text-slate-500">
            {products.length === 0 ? 'No items available yet.' : 'No items in this category.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleProducts.map((product) => (
              <div
                key={product._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-orange-100/60"
              >
                <Link to={'/product/' + product._id} className="block">
                  <div className="relative overflow-hidden aspect-square">
                    {product.image ? (
                      <Thumb
                        src={imageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100">
                        <span className="material-symbols-outlined text-5xl text-brand">fastfood</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link to={'/product/' + product._id}>
                    <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-brand transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-slate-500 line-clamp-2 mb-3 min-h-[40px]">
                    {product.description || 'Delicious and freshly prepared'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-brand">{formatPrice(product.price)}</span>
                    <Link
                      to={'/product/' + product._id}
                      className="px-4 py-1.5 bg-brand/10 text-brand text-sm rounded-full group-hover:bg-brand group-hover:text-white transition-colors"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
