import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/auth/LoginPage'
import SignupPage from './pages/auth/SignupPage'
import RestaurantListingPage from './pages/customer/RestaurantListingPage'
import RestaurantMenuPage from './pages/customer/RestaurantMenuPage'
import CustomerDashboard from './pages/customer/CustomerDashboard'
import CartPage from './pages/customer/CartPage'
import CheckoutPage from './pages/customer/CheckoutPage'
import OrderHistoryPage from './pages/customer/OrderHistoryPage'
import OwnerDashboard from './pages/owner/OwnerDashboard'
import AddRestaurantPage from './pages/owner/AddRestaurantPage'
import ManageMenuPage from './pages/owner/ManageMenuPage'
import IncomingOrdersPage from './pages/owner/IncomingOrdersPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import PendingRestaurantsPage from './pages/admin/PendingRestaurantsPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/restaurants" element={<RestaurantListingPage />} />
      <Route path="/restaurants/:id/menu" element={<RestaurantMenuPage />} />

      <Route path="/customer" element={
        <ProtectedRoute roles={['CUSTOMER']}><CustomerDashboard /></ProtectedRoute>
      } />
      <Route path="/cart" element={
        <ProtectedRoute roles={['CUSTOMER']}><CartPage /></ProtectedRoute>
      } />
      <Route path="/checkout" element={
        <ProtectedRoute roles={['CUSTOMER']}><CheckoutPage /></ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute roles={['CUSTOMER']}><OrderHistoryPage /></ProtectedRoute>
      } />

      <Route path="/owner" element={
        <ProtectedRoute roles={['RESTAURANT_OWNER']}><OwnerDashboard /></ProtectedRoute>
      } />
      <Route path="/owner/restaurants/add" element={
        <ProtectedRoute roles={['RESTAURANT_OWNER']}><AddRestaurantPage /></ProtectedRoute>
      } />
      <Route path="/owner/menu/:restaurantId" element={
        <ProtectedRoute roles={['RESTAURANT_OWNER']}><ManageMenuPage /></ProtectedRoute>
      } />
      <Route path="/owner/orders" element={
        <ProtectedRoute roles={['RESTAURANT_OWNER']}><IncomingOrdersPage /></ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/pending" element={
        <ProtectedRoute roles={['ADMIN']}><PendingRestaurantsPage /></ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
