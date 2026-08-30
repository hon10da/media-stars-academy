import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { adminLogin, adminLogout, getAdminProfile } from '@/api/admin.api'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = useCallback(async () => {
    try {
      const res = await getAdminProfile()
      setAdmin(res.data?.data || null)
    } catch {
      setAdmin(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (credentials) => {
    const res = await adminLogin(credentials)
    setAdmin(res.data?.data || null)
    return res
  }

  const logout = async () => {
    try {
      await adminLogout()
    } finally {
      setAdmin(null)
    }
  }

  return (
    <AdminAuthContext.Provider value={{ admin, loading, login, logout, isAuthenticated: !!admin }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
