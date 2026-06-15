import { useNavigate } from 'react-router-dom'
import { useCreateProduct } from '@/hooks/inventory/useProducts'
import { ProductForm } from '@/components/admin/ProductForm'
import { ADMIN_PRODUCTS } from '@/constants/routes'

export default function CreateProductPage() {
  const navigate = useNavigate()
  const { mutate: createProduct, isPending } = useCreateProduct()

  const handleSubmit = (formData: FormData) => {
    createProduct(formData, {
      onSuccess: () => navigate(ADMIN_PRODUCTS),
    })
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Product</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new product to your catalogue</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductForm mode="create" onSubmit={handleSubmit} isPending={isPending} />
      </div>
    </div>
  )
}
