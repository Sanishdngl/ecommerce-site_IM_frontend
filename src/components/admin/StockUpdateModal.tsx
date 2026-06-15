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
    adjustStock(data.delta, {
      onSuccess: () => handleClose(),
    })
  }

  const increment = () => setValue('delta', Number(delta) + 1)
  const decrement = () => setValue('delta', Number(delta) - 1)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Adjust Stock">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {productName && <p className="text-sm text-gray-500">{productName}</p>}

        <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
          <span className="text-sm text-gray-600">Current Quantity</span>
          <span className="font-semibold text-gray-900">{currentQuantity}</span>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">Delta</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={decrement}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
              aria-label="Decrement"
            >
              <Minus size={16} />
            </button>
            <input
              type="number"
              step="1"
              className="flex-1 text-center rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              {...register('delta', { valueAsNumber: true })}
            />
            <button
              type="button"
              onClick={increment}
              className="p-2 rounded-md border border-gray-300 hover:bg-gray-50"
              aria-label="Increment"
            >
              <Plus size={16} />
            </button>
          </div>
          {errors.delta?.message && <p className="text-xs text-red-600">{errors.delta.message}</p>}
        </div>

        <div
          className={`flex items-center justify-between rounded-lg px-4 py-3 ${
            newQuantity < 0 ? 'bg-red-50' : 'bg-primary-50'
          }`}
        >
          <span className="text-sm text-gray-600">New Quantity</span>
          <span
            className={`font-semibold ${newQuantity < 0 ? 'text-red-600' : 'text-primary-700'}`}
          >
            {newQuantity}
          </span>
        </div>

        <Input
          label="Reason (optional)"
          placeholder="Restocked from supplier"
          error={errors.reason?.message}
          {...register('reason')}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isPending} disabled={newQuantity < 0}>
            Save Adjustment
          </Button>
        </div>
      </form>
    </Modal>
  )
}
