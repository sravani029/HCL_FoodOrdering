import { useState } from 'react'
import Modal from './Modal'
import toast from 'react-hot-toast'
import { ratingApi } from '../api/services'

export default function RatingModal({ open, onClose, orderId, onSuccess }) {
  const [stars, setStars] = useState(5)
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    try {
      await ratingApi.add({ orderId, stars })
      toast.success('Thank you for your rating!')
      onSuccess?.()
      onClose()
    } catch (err) {
      toast.error(err.message || 'Failed to submit rating')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Rate Your Order" size="sm">
      <p className="mb-4 text-sm text-slate-500">How was your food delivery experience?</p>
      <div className="mb-6 flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStars(s)}
            className={`text-3xl transition ${s <= stars ? 'text-amber-400' : 'text-slate-200'}`}
          >
            ★
          </button>
        ))}
      </div>
      <button
        onClick={submit}
        disabled={loading}
        className="w-full rounded-xl bg-brand-500 py-3 font-semibold text-white hover:bg-brand-600 disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Submit Rating'}
      </button>
    </Modal>
  )
}
