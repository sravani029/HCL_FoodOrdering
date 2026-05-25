import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const login = (authData) => {
    const userData = {
      userId: authData.userId,
      name: authData.name,
      email: authData.email,
      role: authData.role,
      address: authData.address || '',
    }
    setUser(userData)
    setToken(authData.token)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', authData.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const updateUser = (updates) => {
    const updated = { ...user, ...updates }
    setUser(updated)
    localStorage.setItem('user', JSON.stringify(updated))
  }

  useEffect(() => {
    if (!token) logout()
  }, [token])

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
