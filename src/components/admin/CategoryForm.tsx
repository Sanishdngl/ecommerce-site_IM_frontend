import { useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CategorySchema, type CategoryFormType } from '@/lib/schemas/category.schema'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'

interface Props {
  defaultValues?: Partial<CategoryFormType>
  onSubmit: (data: CategoryFormType) => void
  isPending?: boolean
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function CategoryForm({ defaultValues, onSubmit, isPending }: Props) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, dirtyFields },
    reset,
  } = useForm<CategoryFormType>({
    resolver: zodResolver(CategorySchema),
    defaultValues,
  })

  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [defaultValues, reset])

  const nameValue = useWatch({ control, name: 'name' })
  useEffect(() => {
    if (!dirtyFields.slug) {
      setValue('slug', toSlug(nameValue ?? ''), { shouldValidate: false })
    }
  }, [nameValue, dirtyFields.slug, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        placeholder="Electronics"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Slug"
        placeholder="electronics"
        helperText="URL-friendly identifier. Auto-generated from name."
        error={errors.slug?.message}
        {...register('slug')}
      />
      <div className="pt-2">
        <Button type="submit" className="w-full" loading={isPending}>
          Save Category
        </Button>
      </div>
    </form>
  )
}
