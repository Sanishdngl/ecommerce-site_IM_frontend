import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { Package, Tag, Users, TrendingUp } from 'lucide-react'

const stats = [
  { label: 'Total Products', value: '—', icon: <Package className="w-6 h-6 text-primary-600" /> },
  { label: 'Categories', value: '—', icon: <Tag className="w-6 h-6 text-green-600" /> },
  { label: 'Admin Users', value: '—', icon: <Users className="w-6 h-6 text-purple-600" /> },
  { label: 'Orders', value: '—', icon: <TrendingUp className="w-6 h-6 text-amber-600" /> },
]

export default function DashboardPage() {
  const user = useAdminAuthStore((s) => s.user)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back{user ? `, ${user.username}` : ''}!</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4"
          >
            <div className="p-2 bg-gray-50 rounded-lg">{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-700 mb-2">Getting Started</h2>
        <p className="text-sm text-gray-500">
          Use the sidebar to manage your inventory, categories, products, and admin users. More
          dashboard analytics will be available in a future release.
        </p>
      </div>
    </div>
  )
}
