import { useNavigate } from 'react-router-dom'
import { useCreateProduct, useUploadProductImage } from '@/hooks/inventory/useProducts'
import { ProductForm, type ProductPayload } from '@/components/admin/ProductForm'
import { ADMIN_PRODUCTS } from '@/constants/routes'
import { useAdminDocumentTitle } from '@/hooks/useDocumentTitle'

export default function CreateProductPage() {
  const navigate = useNavigate()
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct()
  const { mutate: uploadImage, isPending: isUploading } = useUploadProductImage()

  const handleSubmit = (payload: ProductPayload, image: File | undefined) => {
    createProduct(payload, {
      onSuccess: (product) => {
        if (image) {
          uploadImage(
            { productId: product.id, file: image },
            { onSettled: () => navigate(ADMIN_PRODUCTS) }
          )
        } else {
          navigate(ADMIN_PRODUCTS)
        }
      },
    })
  }

  useAdminDocumentTitle('Create Product')

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="font-admin text-2xl font-semibold text-graphite">Create Product</h1>
        <p className="text-graphite/60 text-sm mt-1">Add a new product to your catalogue</p>
      </div>

      <div className="bg-white rounded-xl border border-hairline p-6">
        <ProductForm
          mode="create"
          onSubmit={handleSubmit}
          isPending={isCreating || isUploading}
        />
      </div>
    </div>
  )
}
