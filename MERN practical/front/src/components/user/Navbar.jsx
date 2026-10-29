import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className='bg-white border-b border-orange-100 sticky top-0 z-50 shadow-sm'>
      <div className='max-w-7xl mx-auto px-6 h-16 flex items-center justify-between'>
        <Link to='/' className='flex items-center gap-2'>
          <span className='material-symbols-outlined text-brand text-2xl'>restaurant</span>
          <span className='font-display text-xl font-semibold text-brand'>Foodie</span>
        </Link>

        <div className='flex items-center gap-6 text-sm font-medium'>
          <Link to='/' className='text-slate-700 hover:text-brand transition-colors'>Home</Link>
          <Link to='/menu' className='text-slate-700 hover:text-brand transition-colors'>Menu</Link>
          <Link to='/admin' className='inline-flex items-center gap-1 text-slate-700 hover:text-brand transition-colors'>
            <span className='material-symbols-outlined text-xl'>admin_panel_settings</span>
            Admin
          </Link>
          <button type='button' className='relative text-slate-700 hover:text-brand transition-colors' aria-label='Cart'>
            <span className='material-symbols-outlined text-2xl'>shopping_cart</span>
          </button>
          <button type='button' className='text-slate-700 hover:text-brand transition-colors' aria-label='Profile'>
            <span className='material-symbols-outlined text-2xl'>person</span>
          </button>
        </div>
      </div>
    </nav>
  )
}
