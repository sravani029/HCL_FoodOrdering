import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import { ownerApi } from '../../api/services'

const nav = [
  { to: '/owner', label: 'Dashboard', icon: '📊', end: true },
  { to: '/owner/restaurants/add', label: 'Add Restaurant', icon: '➕' },
  { to: '/owner/orders', label: 'Orders', icon: '📦' },
]

export default function IncomingOrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  const load = async () => {
    setLoading(true)
    try {
      const res = await ownerApi.getOrders()
      setOrders(res.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const complete = async (id) => {
    try {
      await ownerApi.completeOrder(id)
      toast.success('Order marked as completed')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <DashboardLayout navItems={nav} title="Incoming Orders">
      {loading ? <Loader /> : orders.length === 0 ? (
        <EmptyState title="No orders yet" description="Orders from customers will appear here." />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="rounded-2xl bg-white p-6 shadow-md">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <h3 className="font-semibold">Order #{order.id}</h3>
                  <p className="text-sm text-slate-500">{order.deliveryAddress}</p>
                  <p className="text-xs text-slate-400">{new Date(order.placedAt).toLocaleString()}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                  order.status === 'PLACED' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                }`}>{order.status}</span>
              </div>
              <div className="mt-3 text-sm">
                {order.items?.map((i) => <p key={i.menuItemId}>{i.name} x{i.quantity}</p>)}
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-bold text-brand-600">${order.totalAmount?.toFixed(2)}</span>
                {order.status === 'PLACED' && (
                  <button onClick={() => complete(order.id)}
                    className="rounded-xl bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
                    Mark Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
