import { Outlet } from 'react-router-dom'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Navbar } from '@/components/public/Navbar'
import { Footer } from '@/components/public/Footer'

export function PublicLayout() {
  return (
    <div className="storefront min-h-screen flex flex-col font-body">
      <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur-sm border-b border-ink/15 h-16 flex items-center px-6">
        <Navbar />
      </header>

      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>

      <footer className="bg-ink text-paper/70 py-10">
        <Footer />
      </footer>
    </div>
  )
}
