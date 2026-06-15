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
  onSubmit: (formData: FormData) => void
  isPending?: boolean
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
    const formData = new FormData()
    formData.append('category_id', data.category_id)
    formData.append('name', data.name)
    if (data.description) formData.append('description', data.description)
    formData.append('price', String(data.price))
    formData.append('stock_quantity', String(data.stock_quantity))
    if (data.image) {
      formData.append('image', data.image)
    }
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <Input
        label="Name"
        placeholder="Classic White Tee"
        error={errors.name?.message}
        {...register('name')}
      />

      <Select
        label="Category"
        options={categoryOptions}
        placeholder={categoriesLoading ? 'Loading categories…' : 'Select a category'}
        error={errors.category_id?.message}
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
          {...register('price')}
        />
        <Input
          label="Stock Quantity"
          type="number"
          step="1"
          min="0"
          placeholder="100"
          error={errors.stock_quantity?.message}
          {...register('stock_quantity')}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="100% cotton t-shirt"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
            <label className="text-sm font-medium text-gray-700">Product Image</label>
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
              className="text-sm text-gray-600"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-lg border border-gray-200"
              />
            )}
            {errors.image?.message && (
              <p className="text-xs text-red-600">{String(errors.image.message)}</p>
            )}
          </div>
        )}
      />

      <div className="pt-2">
        <Button type="submit" className="w-full" loading={isPending}>
          {mode === 'create' ? 'Create Product' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
