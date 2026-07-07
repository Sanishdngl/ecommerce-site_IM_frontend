import { usePublicCategoryList } from '@/hooks/inventory/useCategories'
import { usePublicProductList } from '@/hooks/inventory/useProducts'
import { CategoryCard } from '@/components/public/CategoryCard'
import { ProductGrid } from '@/components/public/ProductGrid'
import { Skeleton } from '@/components/common/Skeleton'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function HomePage() {
  const { data: categories, isLoading: categoriesLoading } = usePublicCategoryList()
  const { data: featuredData, isLoading: productsLoading } = usePublicProductList({
    limit: 8,
  })

  useDocumentTitle('Home')

  const today = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <section className="py-14 sm:py-20 border-b border-ink/15">
        <p className="font-stamp text-xs tracking-widest text-ink/50 mb-4">
          LEDGER — {today.toUpperCase()}
        </p>
        <h1 className="font-display text-4xl sm:text-6xl leading-[1.05] text-ink max-w-2xl">
          Made in small runs.
          <br />
          Counted, not padded.
        </h1>
        <p className="text-ink/60 mt-5 max-w-md text-[15px] leading-relaxed">
          Every listing shows what's actually left on the shelf. When it's gone, we say so — no
          restock promises we can't keep.
        </p>
      </section>

      <section className="py-12 border-b border-ink/15">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-2xl text-ink">Browse by category</h2>
        </div>
        {categoriesLoading ? (
          <Skeleton variant="grid" columns={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-px bg-ink/15 border border-ink/15">
            {(categories ?? []).map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="py-12">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display text-2xl text-ink">Currently in stock</h2>
          <span className="font-stamp text-xs text-ink/40">
            {featuredData?.data.length ?? 0} shown
          </span>
        </div>
        <ProductGrid
          products={featuredData?.data ?? []}
          isLoading={productsLoading}
          isEmpty={!productsLoading && (featuredData?.data.length ?? 0) === 0}
        />
      </section>
    </div>
  )
}
