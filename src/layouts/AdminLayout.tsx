import { Outlet } from 'react-router-dom'

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-1 bg-gray-900 text-white">
          <div className="flex items-center h-16 px-6 border-b border-gray-700">
            <span className="text-lg font-semibold">ShopAdmin</span>
          </div>
          {/* Sidebar injected in Phase 7 */}
        </div>
      </aside>

      <div className="flex flex-col flex-1 lg:pl-64">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          {/* Topbar injected in Phase 7 */}
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
