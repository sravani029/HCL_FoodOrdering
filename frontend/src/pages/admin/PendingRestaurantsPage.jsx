import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { adminApi, imageUrl } from '../../api/services'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
  { to: '/admin/pending', label: 'Pending Requests', icon: '⏳' },
]

export default function PendingRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await adminApi.getPending()
      setRestaurants(res.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const approve = async (id) => {
    try {
      await adminApi.approve(id)
      toast.success('Restaurant approved')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const reject = async (id) => {
    if (!confirm('Reject this restaurant request?')) return
    try {
      await adminApi.reject(id)
      toast.success('Restaurant rejected')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <DashboardLayout navItems={nav} title="Pending Restaurants">
      {loading ? <Loader /> : restaurants.length === 0 ? (
        <EmptyState title="No pending requests" description="All restaurant requests have been processed." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2">
          {restaurants.map((r) => (
            <div key={r.id} className="rounded-2xl bg-white p-6 shadow-md">
              <img src={imageUrl(r.image)} alt={r.name} className="h-40 w-full rounded-xl object-cover" />
              <h3 className="mt-4 font-semibold text-lg">{r.name}</h3>
              <p className="text-sm text-slate-500">Owner: {r.ownerName}</p>
              <div className="mt-2 flex gap-4 text-sm text-slate-600">
                <span>⭐ {r.rating}</span>
                <span>🕐 {r.deliveryTime} min</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={() => approve(r.id)}
                  className="flex-1 rounded-xl bg-green-500 py-2 font-medium text-white hover:bg-green-600">
                  Approve
                </button>
                <button onClick={() => reject(r.id)}
                  className="flex-1 rounded-xl bg-red-50 py-2 font-medium text-red-600 hover:bg-red-100">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
