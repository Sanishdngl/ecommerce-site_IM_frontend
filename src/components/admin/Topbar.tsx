import { LogOut } from 'lucide-react'
import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { useAdminLogout } from '@/hooks/admin/useAdminAuth'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import type { AdminRole } from '@/types/api.types'

function roleLabel(role: AdminRole): string {
  return role.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export function Topbar() {
  const user = useAdminAuthStore((s) => s.user)
  const role = useAdminAuthStore((s) => s.role)
  const { mutate: logout, isPending } = useAdminLogout()

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 w-full">
      <div />
      <div className="flex items-center gap-4">
        {role && <Badge variant="role">{roleLabel(role)}</Badge>}
        {user && <span className="text-sm font-medium text-gray-700">{user.username}</span>}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          loading={isPending}
          className="gap-1.5"
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
    </header>
  )
}
