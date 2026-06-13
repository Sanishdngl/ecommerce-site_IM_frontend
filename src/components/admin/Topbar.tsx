import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { ADMIN_LOGIN } from '@/constants/routes'
import type { AdminRole } from '@/types/api.types'

function roleLabel(role: AdminRole): string {
  return role.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Topbar() {
  const user = useAdminAuthStore((s) => s.user)
  const role = useAdminAuthStore((s) => s.role)
  const logout = useAdminAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate(ADMIN_LOGIN, { replace: true })
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 w-full">
      <div />
      <div className="flex items-center gap-4">
        {role && <Badge variant="role">{roleLabel(role)}</Badge>}
        {user && <span className="text-sm font-medium text-gray-700">{user.username}</span>}
        <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-1.5">
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  )
}
