import { Skeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { ProductCard } from './ProductCard'
import type { Product } from '@/types/api.types'

interface Props {
  products: Product[]
  isLoading: boolean
  isEmpty: boolean
}

export function ProductGrid({ products, isLoading, isEmpty }: Props) {
  if (isLoading) {
    return <Skeleton variant="grid" columns={4} />
  }

  if (isEmpty) {
    return (
      <EmptyState
        title="Nothing here right now"
        description="This run is empty. Check another category, or come back once the next batch is counted in."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-px bg-ink/15 border border-ink/15">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
