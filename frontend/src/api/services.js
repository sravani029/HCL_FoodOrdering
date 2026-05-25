import api from './axios'

export const authApi = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
}

export const restaurantApi = {
  getAll: (search) => api.get('/restaurants', { params: { search } }),
  getMenu: (id) => api.get(`/menu/${id}`),
}

export const cartApi = {
  get: () => api.get('/cart'),
  add: (data) => api.post('/cart/add', data),
  update: (id, quantity) => api.put(`/cart/update/${id}`, null, { params: { quantity } }),
  remove: (id) => api.delete(`/cart/remove/${id}`),
}

export const orderApi = {
  place: (data) => api.post('/orders/place', data),
  cancel: (id) => api.post(`/orders/cancel/${id}`),
  history: () => api.get('/orders/history'),
}

export const ratingApi = {
  add: (data) => api.post('/ratings/add', data),
}

export const userApi = {
  profile: () => api.get('/user/profile'),
  updateAddress: (address) => api.put('/user/address', { address }),
}

export const ownerApi = {
  getRestaurants: () => api.get('/owner/restaurants'),
  addRestaurant: (formData) => api.post('/owner/restaurants/add', formData),
  updateRestaurant: (id, formData) => api.put(`/owner/restaurants/update/${id}`, formData),
  getMenu: (restaurantId) => api.get(`/owner/menu/${restaurantId}`),
  addMenuItem: (formData) => api.post('/owner/menu/add', formData),
  updateMenuItem: (id, formData) => api.put(`/owner/menu/update/${id}`, formData),
  deleteMenuItem: (id) => api.delete(`/owner/menu/delete/${id}`),
  getOrders: () => api.get('/owner/orders'),
  completeOrder: (id) => api.put(`/owner/orders/complete/${id}`),
}

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getPending: () => api.get('/admin/restaurants/pending'),
  approve: (id) => api.put(`/admin/restaurants/approve/${id}`),
  reject: (id) => api.put(`/admin/restaurants/reject/${id}`),
}

export const imageUrl = (path) => {
  if (!path) return 'https://placehold.co/400x300/f97316/ffffff?text=Food'
  if (path.startsWith('http')) return path
  const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
  return `${base}${path}`
}
