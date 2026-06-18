import { Link } from 'react-router-dom'
import { HOME } from '@/constants/routes'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function NotFoundPage() {
  useDocumentTitle('Page Not Found')
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="text-gray-500">Page not found</p>
      <Link to={HOME} className="text-primary-600 hover:underline">
        Go back home
      </Link>
    </div>
  )
}
