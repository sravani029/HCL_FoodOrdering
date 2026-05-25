import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { cartApi, imageUrl } from '../../api/services'

const nav = [
  { to: '/customer', label: 'Home', icon: '🏠', end: true },
  { to: '/restaurants', label: 'Restaurants', icon: '🍽️' },
  { to: '/cart', label: 'Cart', icon: '🛒' },
  { to: '/orders', label: 'Orders', icon: '📦' },
]

export default function CartPage() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await cartApi.get()
      setCart(res.data.data)
    } catch {
      setCart(null)
    } finally {
      setLoading(false)
    }
  }

  const updateQty = async (id, qty) => {
    try {
      const res = await cartApi.update(id, qty)
      setCart(res.data.data)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const remove = async (id) => {
    try {
      const res = await cartApi.remove(id)
      setCart(res.data.data)
      toast.success('Item removed')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <DashboardLayout navItems={nav} title="My Cart">
      {loading ? <Loader /> : !cart?.items?.length ? (
        <EmptyState
          title="Your cart is empty"
          description="Add items from a restaurant menu"
          action={<Link to="/restaurants" className="rounded-xl bg-brand-500 px-6 py-2 text-white">Browse Restaurants</Link>}
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <p className="text-sm text-slate-500">From: <strong>{cart.restaurantName}</strong></p>
            {cart.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm">
                <img src={imageUrl(item.image)} alt="" className="h-16 w-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-brand-600 font-semibold">${item.price?.toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => updateQty(item.id, item.quantity - 1)} className="h-8 w-8 rounded-lg bg-slate-100">−</button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button onClick={() => updateQty(item.id, item.quantity + 1)} className="h-8 w-8 rounded-lg bg-slate-100">+</button>
                </div>
                <button onClick={() => remove(item.id)} className="text-red-500 text-sm">Remove</button>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-white p-6 shadow-md h-fit">
            <h3 className="font-bold text-lg">Order Summary</h3>
            <div className="mt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-brand-600">${cart.total?.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="mt-6 block w-full rounded-xl bg-brand-500 py-3 text-center font-semibold text-white hover:bg-brand-600">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
