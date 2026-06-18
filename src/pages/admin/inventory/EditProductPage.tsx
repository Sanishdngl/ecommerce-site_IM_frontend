import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProductDetail, useUpdateProduct } from '@/hooks/inventory/useProducts'
import { ProductForm } from '@/components/admin/ProductForm'
import { StockUpdateModal } from '@/components/admin/StockUpdateModal'
import { Skeleton } from '@/components/common/Skeleton'
import { Button } from '@/components/common/Button'
import { PackagePlus } from 'lucide-react'
import { ADMIN_PRODUCTS } from '@/constants/routes'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: product, isLoading } = useProductDetail(id!)
  const { mutate: updateProduct, isPending } = useUpdateProduct(id!)
  const [stockModalOpen, setStockModalOpen] = useState(false)

  const handleSubmit = (formData: FormData) => {
    updateProduct(formData, {
      onSuccess: () => navigate(ADMIN_PRODUCTS),
    })
  }

  useDocumentTitle('Edit Product')

  if (isLoading) {
    return (
      <div className="max-w-lg">
        <Skeleton variant="row" rows={5} />
      </div>
    )
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-500 text-sm mt-1">Update product details</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => setStockModalOpen(true)}>
          <PackagePlus size={16} />
          Adjust Stock
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductForm
          mode="edit"
          defaultValues={{
            name: product?.name,
            description: product?.description,
            price: product ? Number(product.price) : undefined,
            stock_quantity: product?.stock_quantity,
            category_id: product?.category_id,
          }}
          currentImageUrl={product?.thumbnail_url}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </div>

      {product && (
        <StockUpdateModal
          isOpen={stockModalOpen}
          onClose={() => setStockModalOpen(false)}
          productId={product.id}
          currentQuantity={product.stock_quantity}
          productName={product.name}
        />
      )}
    </div>
  )
}
