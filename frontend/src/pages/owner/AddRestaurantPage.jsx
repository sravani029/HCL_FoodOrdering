import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import { ownerApi } from '../../api/services'

const nav = [
  { to: '/owner', label: 'Dashboard', icon: '📊', end: true },
  { to: '/owner/restaurants/add', label: 'Add Restaurant', icon: '➕' },
  { to: '/owner/orders', label: 'Orders', icon: '📦' },
]

export default function AddRestaurantPage() {
  const [form, setForm] = useState({ name: '', rating: '4.5', deliveryTime: '30' })
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (!image) { toast.error('Restaurant image is required'); return }
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('rating', form.rating)
    fd.append('deliveryTime', form.deliveryTime)
    fd.append('image', image)
    setLoading(true)
    try {
      await ownerApi.addRestaurant(fd)
      toast.success('Restaurant request submitted!')
      navigate('/owner')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout navItems={nav} title="Add Restaurant">
      <form onSubmit={submit} className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Restaurant Name</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Display Rating</label>
          <input type="number" step="0.1" min="0" max="5" required value={form.rating}
            onChange={(e) => setForm({ ...form, rating: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Delivery Time (minutes)</label>
          <input type="number" required value={form.deliveryTime}
            onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
            className="w-full rounded-xl border border-slate-200 px-4 py-3" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Restaurant Image</label>
          <input type="file" accept="image/*" required onChange={(e) => setImage(e.target.files[0])}
            className="w-full text-sm" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full rounded-xl bg-brand-500 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit Request'}
        </button>
      </form>
    </DashboardLayout>
  )
}
