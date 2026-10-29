import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getCategories, getProducts, IMAGE_BASE } from '../../services/api.js'
import Thumb from '../../components/user/Thumb.jsx'

const imageUrl = (path) =>
  path && path !== 'null' ? IMAGE_BASE + '/' + path : ''

const formatPrice = (price) =>
  typeof price === 'number' ? 'Rs. ' + price : 'Rs. ' + price

function SkeletonGrid({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-xl bg-orange-100/60" />
          <div className="mt-4 h-4 w-2/3 rounded bg-orange-100/60" />
          <div className="mt-2 h-3 w-1/3 rounded bg-orange-100/60" />
        </div>
      ))}
    </div>
  )
}

export default function Home() {
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

  const activeCatName = activeCategory === 'all' ? 'All' : (categories.find(c => c._id === activeCategory)?.name || 'Category')

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1600&h=900&fit=crop"
            alt="Delicious food"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-gold text-sm font-semibold tracking-[0.3em] uppercase mb-4">
              Fresh & Tasty
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              Delicious Food, Served Fresh
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 leading-relaxed">
              Handcrafted meals made with the finest ingredients. Browse our menu and discover your new favorite dish.
            </p>
            <a
              href="/menu"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand text-white text-base font-semibold rounded-full hover:bg-brand-dark transition-all shadow-lg hover:shadow-xl"
            >
              Explore Menu
              <span className="material-symbols-outlined">arrow_forward</span>
            </a>
          </div>
        </div>
      </section>

      <section id="categories" className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-slate-900 mb-1">Browse Categories</h2>
            <p className="text-slate-600">Find your favorite food category</p>
          </div>
        </div>
        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse shrink-0">
                <div className="w-28 h-28 rounded-full bg-orange-100/60" />
                <div className="mt-3 h-3 w-16 mx-auto rounded bg-orange-100/60" />
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <button
              onClick={() => setActiveCategory('all')}
              className={'flex flex-col items-center gap-2 group transition-all ' + (activeCategory === 'all' ? 'scale-105' : '')}
            >
              <div className={'w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 ' + (activeCategory === 'all' ? 'border-brand' : 'border-transparent') + ' shadow-md group-hover:shadow-lg transition-all bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center'}>
                <span className="material-symbols-outlined text-3xl text-brand">restaurant_menu</span>
              </div>
              <span className={'text-sm font-medium ' + (activeCategory === 'all' ? 'text-brand' : 'text-slate-700')}>All</span>
            </button>
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  setActiveCategory(cat._id)
                  const el = document.getElementById('menu')
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={'flex flex-col items-center gap-2 group transition-all ' + (activeCategory === cat._id ? 'scale-105' : '')}
              >
                <div className={'w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 ' + (activeCategory === cat._id ? 'border-brand' : 'border-transparent') + ' shadow-md group-hover:shadow-lg transition-all bg-white'}>
                  {cat.image ? (
                    <Thumb
                      src={imageUrl(cat.image)}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-50">
                      <span className="material-symbols-outlined text-3xl text-brand">fastfood</span>
                    </div>
                  )}
                </div>
                <span className={'text-sm font-medium ' + (activeCategory === cat._id ? 'text-brand' : 'text-slate-700')}>{cat.name}</span>
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section id="menu" className="bg-cream/40 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-slate-900 mb-1">{activeCatName === 'All' ? 'Featured Items' : activeCatName}</h2>
              <p className="text-slate-600">Choose from our delicious selection</p>
            </div>
            <a href="/menu" className="text-brand hover:text-brand-dark font-medium text-sm">View All Menu</a>
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
        </div>
      </section>
    </div>
  )
}
