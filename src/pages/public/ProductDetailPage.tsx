import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EmptyState } from '@/components/common/EmptyState'
import { PRODUCTS } from '@/constants/routes'
import { ImageOff, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { usePublicProductDetail, usePublicProductList } from '@/hooks/inventory/useProducts'
import { useCartStore } from '@/stores/cart.store'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { useAddToCart } from '@/hooks/customer/useCart'
import { Skeleton } from '@/components/common/Skeleton'
import { Button } from '@/components/common/Button'
import { ProductGrid } from '@/components/public/ProductGrid'
import { formatCurrency } from '@/utils/formatCurrency'
import { usePublicCategoryList } from '@/hooks/inventory/useCategories'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: product, isLoading } = usePublicProductDetail(id!)
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)

  const { mutate: addToCart, isPending: isAddingToCart } = useAddToCart()
  const addGuestItem = useCartStore((s) => s.addItem)
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated())

  const { data: categories } = usePublicCategoryList()
  const categorySlug = categories?.find((c) => c.id === product?.category_id)?.slug

  const { data: relatedData } = usePublicProductList({
    categorySlug,
    limit: 4,
  })

  useDocumentTitle(product?.name ?? 'Product')

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <Skeleton variant="card" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <EmptyState
          title="Product not found"
          description="This product may have been removed or is no longer available"
          action={{ label: 'Browse Products', onClick: () => navigate(PRODUCTS) }}
        />
      </div>
    )
  }

  const maxQty = Math.min(product.stock_quantity, 99)

  const handleAddToCart = () => {
    if (isAuthenticated) {
      addToCart({ product_id: product.id, quantity })
      return
    }
    addGuestItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.thumbnail_url,
      quantity,
    })
    toast.success(`Added ${quantity} to cart`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden">
          {product.list_image_url || product.thumbnail_url ? (
            <img
              src={product.list_image_url || product.thumbnail_url || ''}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <ImageOff className="w-16 h-16 text-gray-300" />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary-700">
            {formatCurrency(Number(product.price))}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
          <p className="text-sm text-gray-500">
            {product.stock_quantity > 0 ? `${product.stock_quantity} in stock` : 'Out of stock'}
          </p>

          {product.stock_quantity > 0 && (
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-gray-50"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <input
                  type="number"
                  value={quantity}
                  min={1}
                  max={maxQty}
                  onChange={(e) =>
                    setQuantity(Math.min(maxQty, Math.max(1, Number(e.target.value) || 1)))
                  }
                  className="w-12 text-center text-sm border-x border-gray-300 py-2 focus:outline-none"
                />
                <button
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  className="p-2 hover:bg-gray-50"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <Button onClick={handleAddToCart} loading={isAddingToCart} className="flex-1">
                Add to Cart
              </Button>
            </div>
          )}
        </div>
      </div>

      {relatedData?.data && relatedData.data.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">More from this category</h2>
          <ProductGrid products={relatedData.data} isLoading={false} isEmpty={false} />
        </section>
      )}
    </div>
  )
}
