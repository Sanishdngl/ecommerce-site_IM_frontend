import { Link } from 'react-router-dom'
import { HOME, PRODUCTS } from '@/constants/routes'

export function Footer() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm font-stamp tracking-wide text-paper/50">
        © {new Date().getFullYear()} OPEN STOCK — SMALL BATCH, HONESTLY COUNTED
      </p>
      <div className="flex items-center gap-6 text-sm">
        <Link to={HOME} className="hover:text-paper transition-colors">
          Home
        </Link>
        <Link to={PRODUCTS} className="hover:text-paper transition-colors">
          Shop
        </Link>
      </div>
    </div>
  )
}
