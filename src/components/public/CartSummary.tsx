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
    <div className="border border-ink/20 p-6 space-y-4 sticky top-20 bg-paper">
      <h2 className="font-display text-lg text-ink">Running total</h2>

      <div className="flex justify-between text-sm text-ink/60">
        <span>Items ({totalItems})</span>
        <span className="font-stamp">{formatCurrency(totalPrice)}</span>
      </div>

      <div className="border-t border-ink/15 pt-4 flex justify-between items-baseline">
        <span className="text-sm font-medium text-ink">Total</span>
        <span className="font-stamp text-lg text-ink">{formatCurrency(totalPrice)}</span>
      </div>

      <Button variant="stamp" className="w-full rounded-none" disabled>
        Proceed to checkout
      </Button>
      <p className="font-stamp text-[10px] tracking-wide text-ink/40 text-center">
        CHECKOUT NOT YET OPEN
      </p>
    </div>
  )
}
