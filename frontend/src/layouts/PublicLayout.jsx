import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function PublicLayout({ children }) {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const dashboardPath = () => {
    if (user?.role === 'ADMIN') return '/admin'
    if (user?.role === 'RESTAURANT_OWNER') return '/owner'
    return '/customer'
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍔</span>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-400 bg-clip-text text-transparent">
              FoodHub
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link to={dashboardPath()} className="text-sm font-medium text-slate-600 hover:text-brand-600">
                  Dashboard
                </Link>
                {user?.role === 'CUSTOMER' && (
                  <Link to="/cart" className="rounded-xl bg-brand-50 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-100">
                    Cart
                  </Link>
                )}
                <button onClick={() => { logout(); navigate('/') }} className="text-sm text-slate-500 hover:text-slate-700">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-brand-600">Login</Link>
                <Link to="/signup" className="rounded-xl bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {children}
    </div>
  )
}
