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

function stockLabel(qty: number): string {
  if (qty === 0) return 'sold out'
  if (qty === 1) return 'last one'
  if (qty <= 5) return `${qty} left`
  return `${qty} in stock`
}

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
          description="This listing may have sold through and been retired, or the link is off."
          action={{ label: 'Back to catalog', onClick: () => navigate(PRODUCTS) }}
        />
      </div>
    )
  }

  const maxQty = Math.min(product.stock_quantity, 99)
  const outOfStock = product.stock_quantity === 0
  const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 5

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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="relative aspect-square bg-kraft/30 flex items-center justify-center overflow-hidden">
          {product.list_image_url || product.thumbnail_url ? (
            <img
              src={product.list_image_url || product.thumbnail_url || ''}
              alt={product.name}
              className={outOfStock ? 'w-full h-full object-cover opacity-50 grayscale' : 'w-full h-full object-cover'}
            />
          ) : (
            <ImageOff className="w-16 h-16 text-ink/20" />
          )}
          <span
            className={
              'stamp-badge absolute top-3 right-3 bg-paper ' +
              (outOfStock ? 'text-ink/40' : lowStock ? 'text-stamp' : 'text-moss')
            }
          >
            {stockLabel(product.stock_quantity)}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-display text-3xl text-ink leading-tight">{product.name}</h1>
          <p className="font-stamp text-2xl text-ink">{formatCurrency(Number(product.price))}</p>
          <p className="text-sm text-ink/60 leading-relaxed">{product.description}</p>

          {!outOfStock && (
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center border border-ink/30">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-kraft/30 text-ink"
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
                  className="w-12 text-center text-sm font-stamp border-x border-ink/30 py-2 bg-paper text-ink focus:outline-none"
                />
                <button
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  className="p-2 hover:bg-kraft/30 text-ink"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
              <Button
                variant="stamp"
                onClick={handleAddToCart}
                loading={isAddingToCart}
                className="flex-1 rounded-none"
              >
                Add to cart
              </Button>
            </div>
          )}
        </div>
      </div>

      {relatedData?.data && relatedData.data.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-ink mb-5">More from this category</h2>
          <ProductGrid products={relatedData.data} isLoading={false} isEmpty={false} />
        </section>
      )}
    </div>
  )
}
