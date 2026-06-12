import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/admin/Sidebar'
import { Topbar } from '@/components/admin/Topbar'

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      <div className="flex flex-col flex-1 lg:pl-64">
        <Topbar />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
