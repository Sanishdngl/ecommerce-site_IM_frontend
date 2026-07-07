import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ProductSchema,
  type ProductFormInput,
  type ProductFormType,
} from '@/lib/schemas/product.schema'
import { useAdminCategoryList } from '@/hooks/inventory/useCategories'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Button } from '@/components/common/Button'
import type { Product } from '@/types/api.types'

interface Props {
  mode: 'create' | 'edit'
  defaultValues?: Partial<ProductFormInput>
  currentImageUrl?: Product['thumbnail_url']
  onSubmit: (data: ProductPayload, image: File | undefined) => void
  isPending?: boolean
}

export interface ProductPayload {
  category_id: string
  name: string
  description?: string
  price: string
  stock_quantity: number
}

export function ProductForm({ mode, defaultValues, currentImageUrl, onSubmit, isPending }: Props) {
  const { data: categories, isLoading: categoriesLoading } = useAdminCategoryList()
  const [preview, setPreview] = useState<string | null>(currentImageUrl ?? null)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProductFormInput, unknown, ProductFormType>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  })

  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [defaultValues, reset])

  const categoryOptions = (categories ?? []).map((c) => ({
    value: c.id,
    label: c.name,
  }))

  const handleFormSubmit = (data: ProductFormType) => {
    const payload: ProductPayload = {
      category_id: data.category_id,
      name: data.name,
      price: data.price.toFixed(2),
      stock_quantity: data.stock_quantity,
      ...(data.description ? { description: data.description } : {}),
    }
    onSubmit(payload, data.image)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Name"
        placeholder="Classic White Tee"
        error={errors.name?.message}
        labelClassName="text-graphite/70"
        className="focus:ring-signal focus:border-signal"
        {...register('name')}
      />

      <Select
        label="Category"
        options={categoryOptions}
        placeholder={categoriesLoading ? 'Loading categories…' : 'Select a category'}
        error={errors.category_id?.message}
        className="focus:ring-signal focus:border-signal"
        {...register('category_id')}
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price"
          type="number"
          step="0.01"
          min="0"
          placeholder="29.99"
          error={errors.price?.message}
          labelClassName="text-graphite/70"
          className="focus:ring-signal focus:border-signal"
          {...register('price')}
        />
        <Input
          label="Stock Quantity"
          type="number"
          step="1"
          min="0"
          placeholder="100"
          error={errors.stock_quantity?.message}
          labelClassName="text-graphite/70"
          className="focus:ring-signal focus:border-signal"
          {...register('stock_quantity')}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-graphite/70">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="100% cotton t-shirt"
          className="w-full rounded-md border border-hairline px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-signal focus:border-signal"
          {...register('description')}
        />
        {errors.description?.message && (
          <p className="text-xs text-red-600">{errors.description.message}</p>
        )}
      </div>

      <Controller
        name="image"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-graphite/70">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                field.onChange(file)
                if (file) {
                  setPreview(URL.createObjectURL(file))
                }
              }}
              className="text-sm text-graphite/70"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-lg border border-hairline"
              />
            )}
            {errors.image?.message && (
              <p className="text-xs text-red-600">{String(errors.image.message)}</p>
            )}
          </div>
        )}
      />

      <div className="pt-2">
        <Button type="submit" variant="signal" className="w-full" loading={isPending}>
          {mode === 'create' ? 'Create Product' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
