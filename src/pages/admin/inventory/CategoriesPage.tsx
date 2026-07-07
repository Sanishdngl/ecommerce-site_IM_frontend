import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useAdminCategoryList, useDeleteCategory } from '@/hooks/inventory/useCategories'
import { Table } from '@/components/common/Table'
import { Button } from '@/components/common/Button'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { formatDate } from '@/utils/formatDate'
import { ADMIN_CATEGORIES_NEW, adminCategoriesEdit } from '@/constants/routes'
import type { Category } from '@/types/api.types'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useAdminAuthStore } from '@/stores/adminAuth.store'

export default function CategoriesPage() {
  const navigate = useNavigate()
  const role = useAdminAuthStore((s) => s.role)
  const { data: categories, isLoading } = useAdminCategoryList()
  const { mutateAsync: deleteCategory } = useDeleteCategory()
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null)

  const canWrite = role === 'super_admin' || role === 'maintainer'
  const canDelete = role === 'super_admin'

  const columns: ColumnDef<Category, unknown>[] = [
    { header: 'Name', accessorKey: 'name' },
    {
      header: 'Slug',
      accessorKey: 'slug',
      cell: ({ row }) => (
        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
          {row.original.slug}
        </code>
      ),
    },
    {
      header: 'Created',
      accessorKey: 'created_at',
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      header: 'Actions',
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {canWrite && (
            <button
              onClick={() => navigate(adminCategoriesEdit(row.original.id))}
              className="p-1.5 text-gray-500 hover:text-primary-600 transition-colors"
              title="Edit"
            >
              <Pencil size={15} />
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => setDeleteTarget(row.original)}
              className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      ),
    },
  ]

  useDocumentTitle('Categories')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Manage product categories</p>
        </div>
        {canWrite && (
          <Button onClick={() => navigate(ADMIN_CATEGORIES_NEW)}>
            <Plus size={16} />
            New Category
          </Button>
        )}
      </div>

      <Table
        columns={columns}
        data={categories ?? []}
        isLoading={isLoading}
        emptyTitle="No categories yet"
        emptyDescription="Create your first category to organise products"
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteCategory(deleteTarget!.id)}
        title="Delete Category"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  )
}
