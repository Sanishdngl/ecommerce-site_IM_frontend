import { useSearchParams } from 'react-router-dom'
import { usePublicCategoryList } from '@/hooks/inventory/useCategories'
import { usePublicProductList } from '@/hooks/inventory/useProducts'
import { ProductGrid } from '@/components/public/ProductGrid'
import { Select } from '@/components/common/Select'
import { Pagination } from '@/components/common/Pagination'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryId = searchParams.get('categoryId') ?? ''
  const page = Number(searchParams.get('page') ?? 1)

  const { data: categories } = usePublicCategoryList()
  const { data, isLoading } = usePublicProductList({
    categorySlug: categoryId || undefined,
    page,
    limit: 12,
  })

  const categoryOptions = (categories ?? []).map((c) => ({
    value: c.slug,
    label: c.name,
  }))

  const activeCategoryName = categories?.find((c) => c.slug === categoryId)?.name

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('categoryId', value)
    } else {
      params.delete('categoryId')
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const handlePageChange = (p: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', String(p))
    setSearchParams(params)
  }

  useDocumentTitle('Shop')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4 pb-6 border-b border-ink/15">
        <div>
          <p className="font-stamp text-xs tracking-widest text-ink/50 mb-2">FULL CATALOG</p>
          <h1 className="font-display text-3xl text-ink">{activeCategoryName ?? 'Everything in stock'}</h1>
        </div>
        <div className="w-full sm:w-56">
          <Select
            placeholder="All categories"
            options={categoryOptions}
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="bg-paper border-ink/30 rounded-none focus:ring-stamp focus:border-stamp"
          />
        </div>
      </div>

      <ProductGrid
        products={data?.data ?? []}
        isLoading={isLoading}
        isEmpty={!isLoading && (data?.data.length ?? 0) === 0}
      />

      {data?.pagination && (
        <Pagination pagination={data.pagination} onPageChange={handlePageChange} />
      )}
    </div>
  )
}
