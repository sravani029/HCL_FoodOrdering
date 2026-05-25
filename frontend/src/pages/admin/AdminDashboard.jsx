import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import Loader from '../../components/Loader'
import { adminApi } from '../../api/services'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/pending', label: 'Pending Requests', icon: '⏳' },
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminApi.getStats().then((r) => setStats(r.data.data)).finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout navItems={nav} title="Admin Dashboard">
      {loading ? <Loader /> : (
        <>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { label: 'Total Restaurants', value: stats?.totalRestaurants, color: 'from-blue-500 to-blue-600' },
              { label: 'Approved', value: stats?.totalApproved, color: 'from-green-500 to-green-600' },
              { label: 'Pending', value: stats?.totalPending, color: 'from-amber-500 to-amber-600' },
            ].map((s) => (
              <div key={s.label} className={`rounded-2xl bg-gradient-to-br ${s.color} p-6 text-white shadow-lg`}>
                <p className="text-sm text-white/80">{s.label}</p>
                <p className="mt-2 text-4xl font-bold">{s.value ?? 0}</p>
              </div>
            ))}
          </div>
          <Link to="/admin/pending"
            className="mt-8 inline-flex rounded-xl bg-brand-500 px-6 py-3 font-semibold text-white hover:bg-brand-600">
            Review Pending Restaurants →
          </Link>
        </>
      )}
    </DashboardLayout>
  )
}
