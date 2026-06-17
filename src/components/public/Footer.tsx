import { Link } from 'react-router-dom'
import { HOME, PRODUCTS } from '@/constants/routes'

export function Footer() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-gray-400">
        © {new Date().getFullYear()} ShopFront. All rights reserved.
      </p>
      <div className="flex items-center gap-6 text-sm">
        <Link to={HOME} className="hover:text-white transition-colors">
          Home
        </Link>
        <Link to={PRODUCTS} className="hover:text-white transition-colors">
          Shop
        </Link>
      </div>
    </div>
  )
}
