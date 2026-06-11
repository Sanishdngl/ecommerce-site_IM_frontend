import { Navigate } from 'react-router-dom'
import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { ADMIN_DASHBOARD } from '@/constants/routes'
import type { AdminRole } from '@/types/api.types'

interface Props {
  allowedRoles: AdminRole[]
  children: React.ReactNode
}

export function RoleRoute({ allowedRoles, children }: Props) {
  const role = useAdminAuthStore((s) => s.role)

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={ADMIN_DASHBOARD} replace />
  }

  return <>{children}</>
}
