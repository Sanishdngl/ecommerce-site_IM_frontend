import { Navigate, useLocation } from 'react-router-dom'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { LOGIN } from '@/constants/routes'

interface Props {
  children: React.ReactNode
}

export function CustomerRoute({ children }: Props) {
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated())
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to={LOGIN} state={{ from: location }} replace />
  }

  return <>{children}</>
}
