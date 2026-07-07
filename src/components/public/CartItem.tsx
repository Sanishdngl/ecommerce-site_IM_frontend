import { useRef, useState } from 'react'
import { ImageOff, Minus, Plus, Trash2 } from 'lucide-react'
import { useUpdateCartItem, useRemoveCartItem } from '@/hooks/customer/useCart'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { Spinner } from '@/components/common/Spinner'
import { formatCurrency } from '@/utils/formatCurrency'
import type { CartItem as CartItemType } from '@/types/api.types'

interface Props {
  item: CartItemType
  line: number
}

const DEBOUNCE_MS = 300

export function CartItem({ item, line }: Props) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [lastSynced, setLastSynced] = useState(item.quantity)

  if (item.quantity !== lastSynced) {
    setLastSynced(item.quantity)
    setQuantity(item.quantity)
  }

  const [confirmRemove, setConfirmRemove] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateCartItem(item.product_id)
  const { mutateAsync: removeItem, isPending: isRemoving } = useRemoveCartItem()

  const scheduleUpdate = (next: number) => {
    setQuantity(next)
    setLastSynced(next)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      updateQuantity(next)
    }, DEBOUNCE_MS)
  }

  const handleDecrement = () => {
    if (quantity <= 1) {
      setConfirmRemove(true)
      return
    }
    scheduleUpdate(quantity - 1)
  }

  const handleIncrement = () => {
    const max = Math.min(item.stock_quantity, 99)
    scheduleUpdate(Math.min(max, quantity + 1))
  }

  const isPending = isUpdating || isRemoving

  return (
    <div className="flex items-center gap-4 py-4 relative">
      {isPending && (
        <div className="absolute inset-0 bg-paper/70 flex items-center justify-center z-10">
          <Spinner size="sm" />
        </div>
      )}

      <span className="font-stamp text-xs text-ink/35 w-5 shrink-0">
        {String(line).padStart(2, '0')}
      </span>

      <div className="w-16 h-16 bg-kraft/30 flex items-center justify-center overflow-hidden shrink-0">
        {item.thumbnail_url ? (
          <img
            src={item.thumbnail_url}
            alt={item.product_name}
            className="w-full h-full object-cover"
          />
        ) : (
          <ImageOff className="w-6 h-6 text-ink/20" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{item.product_name}</p>
        <p className="font-stamp text-xs text-ink/50">{formatCurrency(Number(item.price))} each</p>
      </div>

      <div className="flex items-center border border-ink/25">
        <button
          onClick={handleDecrement}
          className="p-1.5 hover:bg-kraft/30 text-ink"
          aria-label="Decrease quantity"
        >
          <Minus size={14} />
        </button>
        <span className="w-8 text-center text-sm font-stamp text-ink">{quantity}</span>
        <button
          onClick={handleIncrement}
          className="p-1.5 hover:bg-kraft/30 text-ink"
          aria-label="Increase quantity"
          disabled={quantity >= item.stock_quantity}
        >
          <Plus size={14} />
        </button>
      </div>

      <p className="w-20 text-right font-stamp text-sm text-ink">
        {formatCurrency(Number(item.price) * quantity)}
      </p>

      <button
        onClick={() => setConfirmRemove(true)}
        className="p-1.5 text-ink/40 hover:text-stamp transition-colors"
        aria-label="Remove item"
      >
        <Trash2 size={16} />
      </button>

      <ConfirmDialog
        isOpen={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        onConfirm={() => removeItem(item.product_id)}
        title="Remove item"
        message={`Remove "${item.product_name}" from your cart?`}
        confirmLabel="Remove"
      />
    </div>
  )
}
