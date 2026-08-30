import { Navigate, Outlet } from 'react-router-dom'
import { useAdminAuth } from '@/context/AdminAuthContext'

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAdminAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy">
        <div className="w-10 h-10 border-4 border-white/20 border-t-[var(--color-gold)] rounded-full animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}
