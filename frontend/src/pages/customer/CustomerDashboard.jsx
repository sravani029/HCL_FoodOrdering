import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/customer', label: 'Home', icon: '🏠', end: true },
  { to: '/restaurants', label: 'Restaurants', icon: '🍽️' },
  { to: '/cart', label: 'Cart', icon: '🛒' },
  { to: '/orders', label: 'Orders', icon: '📦' },
]

export default function CustomerDashboard() {
  const { user } = useAuth()

  return (
    <DashboardLayout navItems={nav} title={`Welcome, ${user?.name}`}>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { to: '/restaurants', icon: '🍽️', title: 'Browse Restaurants', desc: 'Find approved restaurants near you' },
          { to: '/cart', icon: '🛒', title: 'My Cart', desc: 'Review and checkout your items' },
          { to: '/orders', icon: '📦', title: 'Order History', desc: 'Track, cancel, or rate orders' },
        ].map((card) => (
          <Link key={card.to} to={card.to} className="gradient-card rounded-2xl border border-orange-100 p-6 shadow-sm transition hover:shadow-lg">
            <span className="text-4xl">{card.icon}</span>
            <h3 className="mt-4 font-semibold text-slate-800">{card.title}</h3>
            <p className="mt-2 text-sm text-slate-500">{card.desc}</p>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  )
}
