import { Link } from 'react-router-dom'
import { ImageOff } from 'lucide-react'
import { productDetail } from '@/constants/routes'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCartStore } from '@/stores/cart.store'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { useAddToCart } from '@/hooks/customer/useCart'
import { Button } from '@/components/common/Button'
import toast from 'react-hot-toast'
import type { Product } from '@/types/api.types'

interface Props {
  product: Product
}

export function ProductCard({ product }: Props) {
  const addGuestItem = useCartStore((s) => s.addItem)
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated())
  const { mutate: addToCart, isPending } = useAddToCart()

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
      className="group flex flex-col rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
        {product.thumbnail_url ? (
          <img
            src={product.thumbnail_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        ) : (
          <ImageOff className="w-10 h-10 text-gray-300" />
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 gap-2">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">{product.name}</h3>
        <p className="text-base font-semibold text-gray-900">
          {formatCurrency(Number(product.price))}
        </p>
        <Button
          size="sm"
          variant="secondary"
          onClick={handleAddToCart}
          loading={isPending}
          className="mt-auto w-full"
          disabled={product.stock_quantity === 0}
        >
          {product.stock_quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </Link>
  )
}
