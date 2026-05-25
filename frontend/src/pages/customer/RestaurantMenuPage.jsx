import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import PublicLayout from '../../layouts/PublicLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { restaurantApi, cartApi, imageUrl } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

export default function RestaurantMenuPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [id])

  const load = async () => {
    setLoading(true)
    try {
      const res = await restaurantApi.getMenu(id)
      setMenu(res.data.data || [])
    } catch {
      setMenu([])
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (item) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items')
      return
    }
    try {
      await cartApi.add({ menuItemId: item.id, quantity: 1 })
      toast.success(`${item.name} added to cart`)
    } catch (err) {
      toast.error(err.message || 'Could not add to cart')
    }
  }

  const categories = [...new Set(menu.map((m) => m.category))]

  return (
    <PublicLayout>
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900">Menu</h1>
        {loading ? (
          <Loader />
        ) : menu.length === 0 ? (
          <EmptyState title="No menu items" description="This restaurant has no items yet." />
        ) : (
          categories.map((cat) => (
            <div key={cat} className="mt-8">
              <h2 className="mb-4 text-lg font-semibold text-brand-600">{cat}</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {menu.filter((m) => m.category === cat).map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-2xl bg-white p-4 shadow-md">
                    <img src={imageUrl(item.image)} alt={item.name} className="h-24 w-24 rounded-xl object-cover" />
                    <div className="flex flex-1 flex-col">
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-lg font-bold text-brand-600">${item.price?.toFixed(2)}</p>
                      {!item.available && <span className="text-xs text-red-500">Unavailable</span>}
                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.available}
                        className="mt-auto rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600 disabled:opacity-40"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </PublicLayout>
  )
}
