import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, Plus, PackagePlus, ImageOff } from 'lucide-react'
import { useAdminProductList, useDeleteProduct } from '@/hooks/inventory/useProducts'
import { useAdminCategoryList } from '@/hooks/inventory/useCategories'
import { Table } from '@/components/common/Table'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { Badge } from '@/components/common/Badge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { StockUpdateModal } from '@/components/admin/StockUpdateModal'
import { formatCurrency } from '@/utils/formatCurrency'
import { ADMIN_PRODUCTS_NEW, adminProductsEdit } from '@/constants/routes'
import type { Product } from '@/types/api.types'

const LOW_STOCK_THRESHOLD = 10

export default function ProductsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? 1)
  const categoryId = searchParams.get('categoryId') ?? ''

  const { data: categories } = useAdminCategoryList()
  const { data, isLoading } = useAdminProductList({ page, categoryId: categoryId || undefined })
  const { mutateAsync: deleteProduct } = useDeleteProduct()

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [stockTarget, setStockTarget] = useState<Product | null>(null)

  const categoryOptions = (categories ?? []).map((c) => ({ value: c.id, label: c.name }))

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set('categoryId', value)
    } else {
      params.delete('categoryId')
    }
    params.set('page', '1')
    setSearchParams(params)
  }

  const columns: ColumnDef<Product, unknown>[] = [
    {
      header: 'Image',
      id: 'thumbnail',
      cell: ({ row }) =>
        row.original.thumbnail_url ? (
          <img
            src={row.original.thumbnail_url}
            alt={row.original.name}
            className="w-10 h-10 object-cover rounded-md border border-gray-200"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 bg-gray-50">
            <ImageOff size={16} className="text-gray-300" />
          </div>
        ),
    },
    { header: 'Name', accessorKey: 'name' },
    {
      header: 'Category',
      id: 'category',
      cell: ({ row }) => {
        const cat = categories?.find((c) => c.id === row.original.category_id)
        return cat?.name ?? '—'
      },
    },
    {
      header: 'Price',
      accessorKey: 'price',
      cell: ({ row }) => formatCurrency(Number(row.original.price)),
    },
    {
      header: 'Stock',
      accessorKey: 'stock_quantity',
      cell: ({ row }) => {
        const qty = row.original.stock_quantity
        if (qty === 0) {
          return (
            <div className="flex items-center gap-2">
              <span>{qty}</span>
              <Badge variant="out-of-stock">Out of Stock</Badge>
            </div>
          )
        }
        if (qty < LOW_STOCK_THRESHOLD) {
          return (
            <div className="flex items-center gap-2">
              <span>{qty}</span>
              <Badge variant="low-stock">Low Stock</Badge>
            </div>
          )
        }
        return qty
      },
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(adminProductsEdit(row.original.id))}
            className="p-1.5 text-gray-500 hover:text-primary-600 transition-colors"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setStockTarget(row.original)}
            className="p-1.5 text-gray-500 hover:text-green-600 transition-colors"
            title="Adjust Stock"
          >
            <PackagePlus size={15} />
          </button>
          <button
            onClick={() => setDeleteTarget(row.original)}
            className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your product catalogue</p>
        </div>
        <Button onClick={() => navigate(ADMIN_PRODUCTS_NEW)}>
          <Plus size={16} />
          New Product
        </Button>
      </div>

      <div className="max-w-xs">
        <Select
          label="Filter by category"
          placeholder="All categories"
          options={categoryOptions}
          value={categoryId}
          onChange={(e) => handleCategoryChange(e.target.value)}
        />
      </div>

      <Table
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        pagination={data?.pagination}
        onPageChange={(p) => {
          const params = new URLSearchParams(searchParams)
          params.set('page', String(p))
          setSearchParams(params)
        }}
        emptyTitle="No products found"
        emptyDescription="Create your first product to get started"
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteProduct(deleteTarget!.id)}
        title="Delete Product"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will hide it from the public store.`}
      />

      {stockTarget && (
        <StockUpdateModal
          isOpen={!!stockTarget}
          onClose={() => setStockTarget(null)}
          productId={stockTarget.id}
          currentQuantity={stockTarget.stock_quantity}
          productName={stockTarget.name}
        />
      )}
    </div>
  )
}
