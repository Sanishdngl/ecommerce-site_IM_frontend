import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Tag, Package, Upload, Menu, X } from 'lucide-react'
import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { cn } from '@/utils/cn'
import * as R from '@/constants/routes'
import type { AdminRole } from '@/types/api.types'

interface NavItem {
  label: string
  to: string
  icon: React.ReactNode
  roles?: AdminRole[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    to: R.ADMIN_DASHBOARD,
    icon: <LayoutDashboard size={18} />,
  },
  {
    label: 'Users',
    to: R.ADMIN_USERS,
    icon: <Users size={18} />,
    roles: ['super_admin'],
  },
  {
    label: 'Categories',
    to: R.ADMIN_CATEGORIES,
    icon: <Tag size={18} />,
  },
  {
    label: 'Products',
    to: R.ADMIN_PRODUCTS,
    icon: <Package size={18} />,
  },
  {
    label: 'Bulk Upload',
    to: R.ADMIN_BULK_UPLOAD,
    icon: <Upload size={18} />,
    roles: ['super_admin', 'maintainer'],
  },
]

function SidebarLinks({ onClose }: { onClose?: () => void }) {
  const role = useAdminAuthStore((s) => s.role)

  const visible = navItems.filter((item) => !item.roles || (role && item.roles.includes(role)))

  return (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {visible.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onClose}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary-600 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            )
          }
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-900 text-white rounded-md"
        onClick={() => setMobileOpen(true)}
        aria-label="Open sidebar"
      >
        <Menu size={20} />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform duration-200',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-700">
          <span className="text-lg font-semibold text-white">ShopAdmin</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="text-gray-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>
        <SidebarLinks onClose={() => setMobileOpen(false)} />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-gray-900">
        <div className="flex items-center h-16 px-6 border-b border-gray-700">
          <span className="text-lg font-semibold text-white">ShopAdmin</span>
        </div>
        <SidebarLinks />
      </aside>
    </>
  )
}
