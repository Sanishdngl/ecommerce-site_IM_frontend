import { Button } from '@/components/common/Button'
import { formatCurrency } from '@/utils/formatCurrency'
import type { CartItem } from '@/types/api.types'

interface Props {
  items: CartItem[]
}

export function CartSummary({ items }: Props) {
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)

  return (
    <div className="rounded-xl border border-gray-200 p-6 space-y-4 sticky top-20">
      <h2 className="text-base font-semibold text-gray-900">Order Summary</h2>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Items ({totalItems})</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>

      <div className="border-t border-gray-100 pt-4 flex justify-between text-base font-semibold text-gray-900">
        <span>Total</span>
        <span>{formatCurrency(totalPrice)}</span>
      </div>

      <Button className="w-full" disabled>
        Proceed to Checkout
      </Button>
      <p className="text-xs text-gray-400 text-center">Checkout is coming soon</p>
    </div>
  )
}
