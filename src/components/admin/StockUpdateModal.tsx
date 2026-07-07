import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, Plus } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Input } from '@/components/common/Input'
import { useAdjustStock } from '@/hooks/inventory/useProducts'
import { StockUpdateSchema, type StockUpdateFormType } from '@/lib/schemas/stockUpdate.schema'

interface Props {
  isOpen: boolean
  onClose: () => void
  productId: string
  currentQuantity: number
  productName?: string
}

export function StockUpdateModal({
  isOpen,
  onClose,
  productId,
  currentQuantity,
  productName,
}: Props) {
  const { mutate: adjustStock, isPending } = useAdjustStock(productId)

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors },
  } = useForm<StockUpdateFormType>({
    resolver: zodResolver(StockUpdateSchema),
    defaultValues: { delta: 0, reason: '' },
  })

  const delta = useWatch({ control, name: 'delta' }) || 0
  const newQuantity = currentQuantity + Number(delta || 0)

  const handleClose = () => {
    reset({ delta: 0, reason: '' })
    onClose()
  }

  const onSubmit = (data: StockUpdateFormType) => {
    adjustStock(
      { delta: data.delta, reason: data.reason || undefined },
      { onSuccess: () => handleClose() }
    )
  }

  const increment = () => setValue('delta', Number(delta) + 1)
  const decrement = () => setValue('delta', Number(delta) - 1)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Adjust Stock" className="font-admin">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {productName && <p className="text-sm text-graphite/60">{productName}</p>}

        <div className="flex items-center justify-between bg-console rounded-lg px-4 py-3">
          <span className="text-sm text-graphite/60">Current Quantity</span>
          <span className="font-stamp font-semibold text-graphite">{currentQuantity}</span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-graphite/70">Delta</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={decrement}
              className="p-2 rounded-md border border-hairline hover:bg-console"
              aria-label="Decrement"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              step="1"
              className="flex-1 text-center font-stamp rounded-md border border-hairline px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-signal focus:border-signal"
              {...register('delta', { valueAsNumber: true })}
            />
            <button
              type="button"
              onClick={increment}
              className="p-2 rounded-md border border-hairline hover:bg-console"
              aria-label="Increment"
            >
              <Plus size={16} />
            </button>
          </div>
          {errors.delta?.message && <p className="text-xs text-red-600">{errors.delta.message}</p>}
        </div>

        <div
          className={`flex items-center justify-between rounded-lg px-4 py-3 ${
            newQuantity < 0 ? 'bg-red-50' : 'bg-signal-50'
          }`}
        >
          <span className="text-sm text-graphite/60">New Quantity</span>
          <span
            className={`font-stamp font-semibold ${newQuantity < 0 ? 'text-red-600' : 'text-signal-dim'}`}
          >
            {newQuantity}
          </span>
        </div>

        <Input
          label="Reason (optional)"
          placeholder="Restocked from supplier"
          error={errors.reason?.message}
          labelClassName="text-graphite/70"
          className="focus:ring-signal focus:border-signal"
          {...register('reason')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="signal" loading={isPending} disabled={newQuantity < 0}>
            Save Adjustment
          </Button>
        </div>
      </form>
    </Modal>
  )
}
