import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import DashboardLayout from '../../layouts/DashboardLayout'
import Loader from '../../components/Loader'
import EmptyState from '../../components/EmptyState'
import Modal from '../../components/Modal'
import { ownerApi, imageUrl } from '../../api/services'

const nav = [
  { to: '/owner', label: 'Dashboard', icon: '📊', end: true },
  { to: '/owner/restaurants/add', label: 'Add Restaurant', icon: '➕' },
  { to: '/owner/orders', label: 'Orders', icon: '📦' },
]

export default function ManageMenuPage() {
  const { restaurantId } = useParams()
  const [menu, setMenu] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [form, setForm] = useState({ name: '', price: '', category: '', available: true })
  const [image, setImage] = useState(null)

  useEffect(() => { load() }, [restaurantId])

  const load = async () => {
    setLoading(true)
    try {
      const res = await ownerApi.getMenu(restaurantId)
      setMenu(res.data.data || [])
    } finally {
      setLoading(false)
    }
  }

  const openAdd = () => {
    setEditItem(null)
    setForm({ name: '', price: '', category: '', available: true })
    setImage(null)
    setModal(true)
  }

  const openEdit = (item) => {
    setEditItem(item)
    setForm({ name: item.name, price: item.price, category: item.category, available: item.available })
    setImage(null)
    setModal(true)
  }

  const save = async () => {
    const fd = new FormData()
    if (!editItem) {
      fd.append('restaurantId', restaurantId)
      if (!image) { toast.error('Image required'); return }
      fd.append('image', image)
    } else if (image) {
      fd.append('image', image)
    }
    fd.append('name', form.name)
    fd.append('price', form.price)
    fd.append('category', form.category)
    fd.append('available', form.available)
    try {
      if (editItem) {
        await ownerApi.updateMenuItem(editItem.id, fd)
        toast.success('Item updated')
      } else {
        await ownerApi.addMenuItem(fd)
        toast.success('Item added')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this menu item?')) return
    try {
      await ownerApi.deleteMenuItem(id)
      toast.success('Deleted')
      load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <DashboardLayout navItems={nav} title="Manage Menu">
      <button onClick={openAdd} className="mb-6 rounded-xl bg-brand-500 px-6 py-2 font-semibold text-white hover:bg-brand-600">
        + Add Menu Item
      </button>
      {loading ? <Loader /> : menu.length === 0 ? (
        <EmptyState title="No menu items" action={<button onClick={openAdd} className="rounded-xl bg-brand-500 px-4 py-2 text-white">Add First Item</button>} />
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-md">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50">
              <tr>
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Available</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {menu.map((item) => (
                <tr key={item.id} className="border-b">
                  <td className="p-4 flex items-center gap-3">
                    <img src={imageUrl(item.image)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    {item.name}
                  </td>
                  <td className="p-4">{item.category}</td>
                  <td className="p-4">Rs.{item.price?.toFixed(2)}</td>
                  <td className="p-4">{item.available ? '✅' : '❌'}</td>
                  <td className="p-4 space-x-2">
                    <button onClick={() => openEdit(item)} className="text-brand-600 hover:underline">Edit</button>
                    <button onClick={() => remove(item.id)} className="text-red-500 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal open={modal} onClose={() => setModal(false)} title={editItem ? 'Edit Item' : 'Add Menu Item'}>
        <div className="space-y-4">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl border px-4 py-2" />
          <input placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full rounded-xl border px-4 py-2" />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-xl border px-4 py-2" />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} />
            Available
          </label>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="w-full text-sm" />
          <button onClick={save} className="w-full rounded-xl bg-brand-500 py-2 text-white">Save</button>
        </div>
      </Modal>
    </DashboardLayout>
  )
}
