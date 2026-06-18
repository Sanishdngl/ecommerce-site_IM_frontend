import { useParams, useNavigate } from 'react-router-dom'
import { useCategoryDetail, useUpdateCategory } from '@/hooks/inventory/useCategories'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { Skeleton } from '@/components/common/Skeleton'
import { ADMIN_CATEGORIES } from '@/constants/routes'
import type { CategoryFormType } from '@/lib/schemas/category.schema'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: category, isLoading } = useCategoryDetail(id!)
  const { mutate: updateCategory, isPending } = useUpdateCategory(id!)

  const handleSubmit = (data: CategoryFormType) => {
    updateCategory(data, {
      onSuccess: () => navigate(ADMIN_CATEGORIES),
    })
  }

  useDocumentTitle('Edit Category')

  if (isLoading) {
    return (
      <div className="max-w-lg">
        <Skeleton variant="row" rows={3} />
      </div>
    )
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-gray-500 text-sm mt-1">Update category details</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <CategoryForm
          defaultValues={{
            name: category?.name,
            slug: category?.slug,
          }}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </div>
    </div>
  )
}
