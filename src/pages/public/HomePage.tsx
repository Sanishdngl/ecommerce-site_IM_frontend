import { usePublicCategoryList } from '@/hooks/inventory/useCategories'
import { usePublicProductList } from '@/hooks/inventory/useProducts'
import { CategoryCard } from '@/components/public/CategoryCard'
import { ProductGrid } from '@/components/public/ProductGrid'
import { Skeleton } from '@/components/common/Skeleton'

export default function HomePage() {
  const { data: categories, isLoading: categoriesLoading } = usePublicCategoryList()
  const { data: featuredData, isLoading: productsLoading } = usePublicProductList({
    limit: 8,
  })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      <section className="text-center py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Discover Products You&apos;ll Love
        </h1>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          Browse our curated categories and find exactly what you&apos;re looking for.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Shop by Category</h2>
        {categoriesLoading ? (
          <Skeleton variant="grid" columns={4} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {(categories ?? []).map((cat) => (
              <CategoryCard key={cat.id} category={cat} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Featured Products</h2>
        <ProductGrid
          products={featuredData?.data ?? []}
          isLoading={productsLoading}
          isEmpty={!productsLoading && (featuredData?.data.length ?? 0) === 0}
        />
      </section>
    </div>
  )
}
