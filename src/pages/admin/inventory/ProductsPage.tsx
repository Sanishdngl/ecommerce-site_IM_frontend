import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, Plus, PackagePlus, ImageOff, ToggleLeft, ToggleRight } from 'lucide-react'
import {
  useAdminProductList,
  useDeleteProduct,
  useToggleProductActive,
} from '@/hooks/inventory/useProducts'
import { useAdminCategoryList } from '@/hooks/inventory/useCategories'
import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { Table } from '@/components/common/Table'
import { Button } from '@/components/common/Button'
import { Select } from '@/components/common/Select'
import { Badge } from '@/components/common/Badge'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { StockUpdateModal } from '@/components/admin/StockUpdateModal'
import { formatCurrency } from '@/utils/formatCurrency'
import { ADMIN_PRODUCTS_NEW, adminProductsEdit } from '@/constants/routes'
import type { Product } from '@/types/api.types'
import { useAdminDocumentTitle } from '@/hooks/useDocumentTitle'

const LOW_STOCK_THRESHOLD = 10

export default function ProductsPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? 1)
  const categoryId = searchParams.get('categoryId') ?? ''
  const role = useAdminAuthStore((s) => s.role)

  const { data: categories } = useAdminCategoryList()
  const { data, isLoading } = useAdminProductList({ page, categoryId: categoryId || undefined })
  const { mutateAsync: deleteProduct } = useDeleteProduct()
  const { mutateAsync: toggleActive } = useToggleProductActive()

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null)
  const [toggleTarget, setToggleTarget] = useState<Product | null>(null)
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
            className="w-10 h-10 object-cover rounded-md border border-hairline"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center rounded-md border border-hairline bg-console">
            <ImageOff size={16} className="text-graphite/30" />
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
      header: 'Status',
      id: 'is_active',
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'active' : 'inactive'}>
          {row.original.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => {
        const canWrite = role === 'super_admin' || role === 'maintainer'
        return (
          <div className="flex items-center gap-2">
            {canWrite && (
              <>
                <button
                  onClick={() => navigate(adminProductsEdit(row.original.id))}
                  className="p-1.5 text-graphite/50 hover:text-signal transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => setStockTarget(row.original)}
                  className="p-1.5 text-graphite/50 hover:text-green-600 transition-colors"
                  title="Adjust Stock"
                >
                  <PackagePlus size={15} />
                </button>
                <button
                  onClick={() => setToggleTarget(row.original)}
                  className="p-1.5 text-graphite/50 hover:text-signal transition-colors"
                  title={row.original.is_active ? 'Deactivate' : 'Activate'}
                >
                  {row.original.is_active ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
                </button>
              </>
            )}
            {role === 'super_admin' && (
              <button
                onClick={() => setDeleteTarget(row.original)}
                className="p-1.5 text-graphite/50 hover:text-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        )
      },
    },
  ]

  useAdminDocumentTitle('Products')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-admin text-2xl font-semibold text-graphite">Products</h1>
          <p className="text-graphite/60 text-sm mt-1">Manage your product catalogue</p>
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
          className="focus:ring-signal focus:border-signal"
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

      <ConfirmDialog
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={() =>
          toggleActive({ id: toggleTarget!.id, is_active: !toggleTarget!.is_active })
        }
        title={toggleTarget?.is_active ? 'Deactivate Product' : 'Activate Product'}
        message={`Are you sure you want to ${toggleTarget?.is_active ? 'deactivate' : 'activate'} "${toggleTarget?.name}"?`}
        confirmLabel={toggleTarget?.is_active ? 'Deactivate' : 'Activate'}
        confirmVariant={toggleTarget?.is_active ? 'danger' : 'primary'}
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
