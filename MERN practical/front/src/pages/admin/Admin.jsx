import { useState } from 'react'
import CategorySection from '../../components/admin/CategorySection.jsx'
import ProductSection from '../../components/admin/ProductSection.jsx'

const TABS = [
  { key: 'products', label: 'Products (Food)', icon: 'fastfood' },
  { key: 'categories', label: 'Categories', icon: 'category' },
]

export default function Admin() {
  const [tab, setTab] = useState('products')

  return (
    <div className='bg-cream/40 min-h-full'>
      <div className='max-w-7xl mx-auto px-6 py-10'>
        <div className='mb-8'>
          <p className='text-brand text-sm font-semibold tracking-[0.2em] uppercase mb-2'>
            Dashboard
          </p>
          <h1 className='font-display text-3xl md:text-4xl font-semibold text-slate-900'>
            Manage Menu
          </h1>
          <p className='text-slate-600 mt-2'>
            Categories aur products ko add, edit aur delete karein.
          </p>
        </div>

        <div className='mb-6 inline-flex flex-wrap gap-2 rounded-2xl bg-white p-1.5 shadow-sm border border-orange-100'>
          {TABS.map((t) => (
            <button
              key={t.key}
              type='button'
              onClick={() => setTab(t.key)}
              className={
                'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ' +
                (tab === t.key
                  ? 'bg-brand text-white shadow'
                  : 'text-slate-600 hover:bg-orange-50')
              }
            >
              <span className='material-symbols-outlined text-lg'>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className='rounded-2xl bg-white p-6 shadow-sm border border-orange-100'>
          {tab === 'categories' ? <CategorySection /> : <ProductSection />}
        </div>
      </div>
    </div>
  )
}
