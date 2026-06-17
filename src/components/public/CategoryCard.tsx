import { Link } from 'react-router-dom'
import { PRODUCTS } from '@/constants/routes'
import type { Category } from '@/types/api.types'

interface Props {
  category: Category
}

export function CategoryCard({ category }: Props) {
  return (
    <Link
      to={`${PRODUCTS}?categoryId=${category.slug}`}
      className="group relative flex items-center justify-center h-32 sm:h-40 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 overflow-hidden"
    >
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      <span className="relative text-white font-semibold text-lg text-center px-4">
        {category.name}
      </span>
    </Link>
  )
}
