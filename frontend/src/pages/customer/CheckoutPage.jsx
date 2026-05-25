import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Loader from '../../components/Loader'
import { cartApi, orderApi, userApi } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const nav = [
  { to: '/customer', label: 'Home', icon: '🏠', end: true },
  { to: '/restaurants', label: 'Restaurants', icon: '🍽️' },
  { to: '/cart', label: 'Cart', icon: '🛒' },
  { to: '/orders', label: 'Orders', icon: '📦' },
]

export default function CheckoutPage() {
  const [cart, setCart] = useState(null)
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [placing, setPlacing] = useState(false)
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    load()
    setAddress(user?.address || '')
  }, [])

  const load = async () => {
    try {
      const [cartRes, profileRes] = await Promise.all([cartApi.get(), userApi.profile()])
      setCart(cartRes.data.data)
      setAddress(profileRes.data.data?.address || user?.address || '')
    } catch {
      navigate('/cart')
    } finally {
      setLoading(false)
    }
  }

  const placeOrder = async () => {
    if (!address.trim()) {
      toast.error('Delivery address is required')
      return
    }
    setPlacing(true)
    try {
      await userApi.updateAddress(address)
      updateUser({ address })
      const res = await orderApi.place({ deliveryAddress: address })
      toast.success('Order placed successfully! (COD)')
      navigate('/orders', { state: { newOrder: res.data.data } })
    } catch (err) {
      toast.error(err.message || 'Failed to place order')
    } finally {
      setPlacing(false)
    }
  }

  return (
    <DashboardLayout navItems={nav} title="Checkout">
      {loading ? <Loader /> : (
        <div className="mx-auto max-w-lg">
          <div className="rounded-2xl bg-white p-6 shadow-md">
            <h3 className="font-bold text-lg mb-4">Delivery Details</h3>
            <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Address *</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              placeholder="Enter your full delivery address"
            />
            <div className="mt-6 rounded-xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Payment Method</p>
              <p className="font-semibold">💵 Cash on Delivery (COD)</p>
            </div>
            <div className="mt-4 flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-brand-600">${cart?.total?.toFixed(2)}</span>
            </div>
            <button
              onClick={placeOrder}
              disabled={placing}
              className="mt-6 w-full rounded-xl bg-brand-500 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
            >
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
