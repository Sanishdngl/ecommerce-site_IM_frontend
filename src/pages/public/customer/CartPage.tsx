import { useCartQuery } from '@/hooks/customer/useCart'
import { CartItem } from '@/components/public/CartItem'
import { CartSummary } from '@/components/public/CartSummary'
import { Skeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { useNavigate } from 'react-router-dom'
import { PRODUCTS } from '@/constants/routes'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function CartPage() {
  const navigate = useNavigate()
  const { data: items, isLoading } = useCartQuery()

  useDocumentTitle('Your Cart')

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      {isLoading ? (
        <Skeleton variant="row" rows={4} />
      ) : !items || items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Browse our products and add something you like"
          action={{ label: 'Browse Products', onClick: () => navigate(PRODUCTS) }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 divide-y divide-gray-100">
            {items.map((item) => (
              <CartItem key={item.product_id} item={item} />
            ))}
          </div>
          <div>
            <CartSummary items={items} />
          </div>
        </div>
      )}
    </div>
  )
}
