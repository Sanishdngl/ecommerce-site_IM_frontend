import { Link } from 'react-router-dom'
import { ImageOff } from 'lucide-react'
import { productDetail } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCartStore } from '@/stores/cart.store'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { useAddToCart } from '@/hooks/customer/useCart'
import { Button } from '@/components/common/Button'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'
import type { Product } from '@/types/api.types'

interface Props {
  product: Product
}

function stockLabel(qty: number): string {
  if (qty === 0) return 'sold out'
  if (qty === 1) return 'last one'
  if (qty <= 5) return `${qty} left`
  return `${qty} in stock`
}

export function ProductCard({ product }: Props) {
  const addGuestItem = useCartStore((s) => s.addItem)
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated())
  const { mutate: addToCart, isPending } = useAddToCart()
  const outOfStock = product.stock_quantity === 0
  const lowStock = product.stock_quantity > 0 && product.stock_quantity <= 5

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isAuthenticated) {
      addToCart({ product_id: product.id, quantity: 1 })
      return
    }

    addGuestItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.thumbnail_url,
      quantity: 1,
    })
    toast.success('Added to cart')
  }

  return (
    <Link
      to={productDetail(product.id)}
      className="group flex flex-col bg-paper overflow-hidden transition-colors hover:bg-kraft/20"
    >
      <div className="relative aspect-square bg-kraft/30 flex items-center justify-center overflow-hidden">
        {product.thumbnail_url ? (
          <img
            src={product.thumbnail_url}
            alt={product.name}
            className={cn(
              'w-full h-full object-cover transition-transform duration-200',
              !outOfStock && 'group-hover:scale-105',
              outOfStock && 'opacity-50 grayscale'
            )}
          />
        ) : (
          <ImageOff className="w-10 h-10 text-ink/20" />
        )}

        <span
          className={cn(
            'stamp-badge absolute top-2 right-2 bg-paper',
            outOfStock ? 'text-ink/40' : lowStock ? 'text-stamp' : 'text-moss'
          )}
        >
          {stockLabel(product.stock_quantity)}
        </span>
      </div>

      <div className="flex flex-col flex-1 p-3 gap-2">
        <h3 className="text-sm font-medium text-ink line-clamp-2">{product.name}</h3>
        <p className="font-stamp text-base text-ink">{formatCurrency(Number(product.price))}</p>
        <Button
          size="sm"
          variant="stampOutline"
          onClick={handleAddToCart}
          loading={isPending}
          className="mt-auto w-full"
          disabled={outOfStock}
        >
          {outOfStock ? 'Sold out' : 'Add to cart'}
        </Button>
      </div>
    </Link>
  )
}
