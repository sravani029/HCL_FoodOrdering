import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Modal from '../../components/Modal'
import { authApi } from '../../api/services'
import { useAuth } from '../../context/AuthContext'

const ROLES = [
  { value: 'CUSTOMER', label: 'Customer' },
  { value: 'RESTAURANT_OWNER', label: 'Restaurant Owner' },
  { value: 'ADMIN', label: 'Admin' },
]

export default function SignupPage() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', role: 'CUSTOMER', address: '',
  })
  const [loading, setLoading] = useState(false)
  const [adminModal, setAdminModal] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (/^[0-9]/.test(form.name)) {
      toast.error('Name must not start with a number')
      return
    }
    setLoading(true)
    try {
      const res = await authApi.signup(form)
      if (res.data.success) {
        login(res.data.data)
        toast.success('Account created!')
        const role = res.data.data.role
        navigate(role === 'ADMIN' ? '/admin' : role === 'RESTAURANT_OWNER' ? '/owner' : '/customer')
      }
    } catch (err) {
      if (err.message?.includes('Admin already registered')) {
        setAdminModal(true)
      } else {
        toast.error(err.message || 'Signup failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-xl shadow-slate-200/50">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">Join FoodHub today</p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Full Name</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email (@gmail.com)</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              placeholder="you@gmail.com" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone (10 digits)</label>
            <input required pattern="[0-9]{10}" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" required value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              placeholder="Min 8 chars, upper, lower, number, special" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none">
              {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
          </div>
          {form.role === 'CUSTOMER' && (
            <div>
              <label className="mb-1 block text-sm font-medium">Address (optional)</label>
              <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20" />
            </div>
          )}
          <button type="submit" disabled={loading}
            className="sm:col-span-2 w-full rounded-xl bg-brand-500 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-50">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          Have an account? <Link to="/login" className="font-medium text-brand-600 hover:underline">Login</Link>
        </p>
      </div>
      <Modal open={adminModal} onClose={() => setAdminModal(false)} title="Admin Already Registered" size="sm">
        <p className="text-slate-600">Only one admin account is allowed in the system. An admin has already been registered.</p>
        <button onClick={() => setAdminModal(false)} className="mt-4 w-full rounded-xl bg-brand-500 py-2 text-white">OK</button>
      </Modal>
    </div>
  )
}
