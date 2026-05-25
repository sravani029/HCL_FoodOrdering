import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Loader from '../../components/Loader'
import { ownerApi } from '../../api/services'

const nav = [
  { to: '/owner', label: 'Dashboard', icon: '📊', end: true },
  { to: '/owner/restaurants/add', label: 'Add Restaurant', icon: '➕' },
  { to: '/owner/orders', label: 'Orders', icon: '📦' },
]

export default function OwnerDashboard() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    ownerApi.getRestaurants().then((r) => setRestaurants(r.data.data || [])).finally(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const setStatus = async (id, status) => {
    const fd = new FormData()
    fd.append('status', status)
    try {
      await ownerApi.updateRestaurant(id, fd)
      toast.success(`Restaurant is now ${status}`)
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <DashboardLayout navItems={nav} title="Owner Dashboard">
      {loading ? <Loader /> : (
        <>
          <div className="mb-6">
            <Link to="/owner/restaurants/add" className="inline-flex rounded-xl bg-brand-500 px-6 py-2 font-semibold text-white hover:bg-brand-600">
              + Add Restaurant
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white p-5 shadow-md">
                <h3 className="font-semibold">{r.name}</h3>
                <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${
                  r.status === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                  r.status === 'APPROVED' || r.status === 'OPEN' ? 'bg-green-100 text-green-700' :
                  'bg-slate-100 text-slate-600'
                }`}>{r.status}</span>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={`/owner/menu/${r.id}`} className="text-sm text-brand-600 hover:underline">Manage Menu</Link>
                  {(r.status === 'APPROVED' || r.status === 'OPEN' || r.status === 'CLOSED') && (
                    <>
                      <button onClick={() => setStatus(r.id, 'OPEN')} className="text-xs rounded-lg bg-green-100 text-green-700 px-2 py-1">Open</button>
                      <button onClick={() => setStatus(r.id, 'CLOSED')} className="text-xs rounded-lg bg-slate-100 text-slate-600 px-2 py-1">Close</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </DashboardLayout>
  )
}
