import { Navigate, useLocation } from 'react-router-dom'
import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { ADMIN_LOGIN } from '@/constants/routes'

interface Props {
  children: React.ReactNode
}

export function AdminRoute({ children }: Props) {
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated())
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={ADMIN_LOGIN} state={{ from: location }} replace />
  }

  return <>{children}</>
}
