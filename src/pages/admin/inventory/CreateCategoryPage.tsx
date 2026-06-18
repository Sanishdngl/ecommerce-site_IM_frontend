import { useNavigate } from 'react-router-dom'
import { useCreateCategory } from '@/hooks/inventory/useCategories'
import { CategoryForm } from '@/components/admin/CategoryForm'
import { ADMIN_CATEGORIES } from '@/constants/routes'
import type { CategoryFormType } from '@/lib/schemas/category.schema'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function CreateCategoryPage() {
  const navigate = useNavigate()
  const { mutate: createCategory, isPending } = useCreateCategory()

  const handleSubmit = (data: CategoryFormType) => {
    createCategory(data, {
      onSuccess: () => navigate(ADMIN_CATEGORIES),
    })
  }

  useDocumentTitle('Create Category')

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Category</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new product category</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <CategoryForm onSubmit={handleSubmit} isPending={isPending} />
      </div>
    </div>
  )
}
