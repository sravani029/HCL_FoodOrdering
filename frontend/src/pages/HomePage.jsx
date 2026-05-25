import { Link } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'

export default function HomePage() {
  return (
    <PublicLayout>
      <section className="gradient-hero px-4 py-20 text-white lg:py-28">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
            Delicious Food, Delivered Fast
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-orange-100">
            Order from the best restaurants near you. Fresh meals, secure COD payment, and real-time tracking.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/restaurants" className="rounded-xl bg-white px-8 py-3 font-semibold text-brand-600 shadow-lg hover:bg-orange-50">
              Browse Restaurants
            </Link>
            <Link to="/signup" className="rounded-xl border-2 border-white px-8 py-3 font-semibold hover:bg-white/10">
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-slate-800">Why FoodHub?</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: '🚀', title: 'Fast Delivery', desc: 'Quick delivery from approved restaurants' },
            { icon: '💳', title: 'COD Payment', desc: 'Pay cash on delivery - simple and secure' },
            { icon: '⭐', title: 'Rate Orders', desc: 'Share feedback after your meal arrives' },
          ].map((f) => (
            <div key={f.title} className="gradient-card rounded-2xl border border-orange-100 p-6 shadow-sm">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="mt-4 font-semibold text-slate-800">{f.title}</h3>
              <p className="mt-2 text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  )
}
