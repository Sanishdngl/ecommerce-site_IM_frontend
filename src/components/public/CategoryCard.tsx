import { Link } from 'react-router-dom'
import { PRODUCTS } from '@/constants/routes'
import type { Category } from '@/types/api.types'

interface Props {
  category: Category
  index: number
}

export function CategoryCard({ category, index }: Props) {
  return (
    <Link
      to={`${PRODUCTS}?categoryId=${category.slug}`}
      className="group relative flex flex-col justify-between h-32 sm:h-40 bg-paper px-4 py-3 overflow-hidden transition-colors hover:bg-kraft/40"
    >
      <span className="font-stamp text-[11px] tracking-widest text-ink/40">
        {String(index + 1).padStart(2, '0')}
      </span>
      <span className="font-display text-lg leading-tight text-ink group-hover:text-stamp transition-colors">
        {category.name}
      </span>
    </Link>
  )
}
