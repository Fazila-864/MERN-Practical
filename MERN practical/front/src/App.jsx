import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom'
import './App.css'
import Navbar from './components/user/Navbar.jsx'
import Home from './pages/user/Home.jsx'
import ProductDetail from './pages/user/ProductDetail.jsx'
import Menu from './pages/user/Menu.jsx'
import Admin from './pages/admin/Admin.jsx'

function Layout() {
  return (
    <div className='min-h-screen flex flex-col bg-white'>
      <Navbar />
      <main className='flex-1'><Outlet /></main>
      <footer className='bg-gradient-to-br from-slate-900 to-slate-950 text-white mt-16'>
        <div className='max-w-7xl mx-auto px-6 py-12'>
          <div className='grid md:grid-cols-4 gap-8 mb-10'>
            <div className='md:col-span-2'>
              <div className='flex items-center gap-2 mb-4'>
                <span className='material-symbols-outlined text-gold text-2xl'>restaurant</span>
                <span className='font-display text-2xl font-semibold'>Foodie</span>
              </div>
              <p className='text-white/70 text-sm leading-relaxed max-w-md mb-4'>
                Serving delicious, freshly prepared meals made with love and the finest ingredients.
              </p>
            </div>
            <div>
              <h3 className='font-semibold mb-4 text-gold'>Quick Links</h3>
              <ul className='space-y-2.5 text-sm text-white/70'>
                <li><a href='/' className='hover:text-gold transition-colors'>Home</a></li>
                <li><a href='/menu' className='hover:text-gold transition-colors'>Menu</a></li>
              </ul>
            </div>
            <div>
              <h3 className='font-semibold mb-4 text-gold'>Opening Hours</h3>
              <ul className='space-y-2.5 text-sm text-white/70'>
                <li className='flex justify-between'><span>Mon - Fri</span><span>9:00 - 22:00</span></li>
                <li className='flex justify-between'><span>Sat - Sun</span><span>10:00 - 23:00</span></li>
              </ul>
            </div>
          </div>
          <div className='pt-8 border-t border-white/10 text-center'>
            <p className='text-sm text-white/50'>© 2026 Foodie. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/product/:id' element={<ProductDetail />} />
          <Route path='/admin' element={<Admin />} />
        </Route>
        <Route path='*' element={<h2 className='p-8 text-center'>404 - Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  )
}
