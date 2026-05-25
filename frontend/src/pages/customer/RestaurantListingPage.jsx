import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PublicLayout from '../../layouts/PublicLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { restaurantApi, imageUrl } from '../../api/services'

export default function RestaurantListingPage() {
  const [restaurants, setRestaurants] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [search])

  const load = async () => {
    setLoading(true)
    try {
      const res = await restaurantApi.getAll(search)
      setRestaurants(res.data.data || [])
    } catch {
      setRestaurants([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Restaurants</h1>
          <input
            type="search"
            placeholder="Search restaurants..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-xl border border-slate-200 px-4 py-2.5 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>
        {loading ? (
          <Loader />
        ) : restaurants.length === 0 ? (
          <EmptyState title="No restaurants found" description="Try a different search or check back later." />
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <Link
                key={r.id}
                to={`/restaurants/${r.id}/menu`}
                className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
              >
                <img src={imageUrl(r.image)} alt={r.name} className="h-48 w-full object-cover transition group-hover:scale-105" />
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-slate-900">{r.name}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      r.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                    }`}>{r.status}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
                    <span>⭐ {r.rating}</span>
                    <span>🕐 {r.deliveryTime} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
