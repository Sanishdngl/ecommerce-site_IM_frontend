import { Outlet } from 'react-router-dom'

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 h-16 flex items-center px-6">
        {/* Navbar injected in Phase 14 */}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8">
        {/* Footer injected in Phase 14 */}
      </footer>
    </div>
  )
}
