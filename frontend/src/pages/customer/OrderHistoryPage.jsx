import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import RatingModal from '../../components/RatingModal'
import { orderApi } from '../../api/services'

const nav = [
  { to: '/customer', label: 'Home', icon: '🏠', end: true },
  { to: '/restaurants', label: 'Restaurants', icon: '🍽️' },
  { to: '/cart', label: 'Cart', icon: '🛒' },
  { to: '/orders', label: 'Orders', icon: '📦' },
]

const statusColors = {
  PLACED: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [ratingOrder, setRatingOrder] = useState(null)
  const [cancelTimers, setCancelTimers] = useState({})

  useEffect(() => { load() }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const timers = {}
      orders.forEach((o) => {
        if (o.canCancel && o.status === 'PLACED') {
          const elapsed = (Date.now() - new Date(o.placedAt).getTime()) / 1000
          timers[o.id] = Math.max(0, 45 - Math.floor(elapsed))
        }
      })
      setCancelTimers(timers)
    }, 1000)
    return () => clearInterval(interval)
  }, [orders])

  const load = async () => {
    setLoading(true)
    try {
      const res = await orderApi.history()
      setOrders(res.data.data || [])
    } catch {
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const cancelOrder = async (id) => {
    try {
      await orderApi.cancel(id)
      toast.success('Order cancelled')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <DashboardLayout navItems={nav} title="Order History">
      {loading ? <Loader /> : orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Place your first order from a restaurant menu." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl bg-white p-6 shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-slate-500">{order.restaurantName}</p>
                  <p className="text-xs text-slate-400 mt-1">{new Date(order.placedAt).toLocaleString()}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <div className="mt-4 text-sm text-slate-600">
                {order.items?.map((i) => (
                  <p key={i.menuItemId}>{i.name} x{i.quantity} - ${i.price?.toFixed(2)}</p>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-brand-600">${order.totalAmount?.toFixed(2)}</span>
                <div className="flex gap-2">
                  {order.canCancel && cancelTimers[order.id] > 0 && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      Cancel ({cancelTimers[order.id]}s)
                    </button>
                  )}
                  {order.canRate && (
                    <button
                      onClick={() => setRatingOrder(order.id)}
                      className="rounded-lg bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-100"
                    >
                      Rate Order
                    </button>
                  )}
                  {order.rated && <span className="text-sm text-green-600">✓ Rated</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <RatingModal
        open={!!ratingOrder}
        onClose={() => setRatingOrder(null)}
        orderId={ratingOrder}
        onSuccess={load}
      />
    </DashboardLayout>
  )
}
