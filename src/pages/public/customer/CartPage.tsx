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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-baseline justify-between mb-6 pb-4 border-b border-ink/15">
        <h1 className="font-display text-3xl text-ink">Your ledger</h1>
        {items && items.length > 0 && (
          <span className="font-stamp text-xs text-ink/40">
            {items.length} {items.length === 1 ? 'line' : 'lines'}
          </span>
        )}
      </div>

      {isLoading ? (
        <Skeleton variant="row" rows={4} />
      ) : !items || items.length === 0 ? (
        <EmptyState
          title="Nothing counted in yet"
          description="Add something from the catalog and it'll show up here, line by line."
          action={{ label: 'Browse catalog', onClick: () => navigate(PRODUCTS) }}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 divide-y divide-ink/10">
            {items.map((item, i) => (
              <CartItem key={item.product_id} item={item} line={i + 1} />
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
