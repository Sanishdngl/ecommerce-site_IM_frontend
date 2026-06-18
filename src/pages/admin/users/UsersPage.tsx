import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2, ToggleLeft, ToggleRight, Plus } from 'lucide-react'
import {
  useAdminUserList,
  useDeleteAdminUser,
  useToggleAdminUser,
} from '@/hooks/admin/useAdminUsers'
import { Table } from '@/components/common/Table'
import { Badge } from '@/components/common/Badge'
import { Button } from '@/components/common/Button'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { formatDate } from '@/utils/formatDate'
import { adminUsersEdit, ADMIN_USERS_NEW } from '@/constants/routes'
import type { AdminUser } from '@/types/api.types'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'


export default function UsersPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? 1)

  const { data, isLoading } = useAdminUserList({ page })
  const { mutateAsync: deleteUser } = useDeleteAdminUser()
  const { mutateAsync: toggleUser } = useToggleAdminUser()

  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null)
  const [toggleTarget, setToggleTarget] = useState<AdminUser | null>(null)

  const columns: ColumnDef<AdminUser, unknown>[] = [
    { header: 'Username', accessorKey: 'username' },
    { header: 'Email', accessorKey: 'email' },
    {
      header: 'Role',
      accessorKey: 'role',
      cell: ({ row }) => (
        <Badge variant="role">
          {row.original.role.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
        </Badge>
      ),
    },
    {
      header: 'Status',
      accessorKey: 'is_active',
      cell: ({ row }) => (
        <Badge variant={row.original.is_active ? 'active' : 'inactive'}>
          {row.original.is_active ? 'Active' : 'Inactive'}
        </Badge>
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
          <button
            onClick={() => navigate(adminUsersEdit(row.original.id))}
            className="p-1.5 text-gray-500 hover:text-primary-600 transition-colors"
            title="Edit"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setToggleTarget(row.original)}
            className="p-1.5 text-gray-500 hover:text-amber-600 transition-colors"
            title={row.original.is_active ? 'Deactivate' : 'Activate'}
          >
            {row.original.is_active ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}
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

  useDocumentTitle("Admin User");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="text-gray-500 text-sm mt-1">Manage administrator accounts</p>
        </div>
        <Button onClick={() => navigate(ADMIN_USERS_NEW)}>
          <Plus size={16} />
          New User
        </Button>
      </div>

      <Table
        columns={columns}
        data={data?.data ?? []}
        isLoading={isLoading}
        pagination={data?.pagination}
        onPageChange={(p) => setSearchParams({ page: String(p) })}
        emptyTitle="No admin users found"
        emptyDescription="Create your first admin user to get started"
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteUser(deleteTarget!.id)}
        title="Delete Admin User"
        message={`Are you sure you want to delete "${deleteTarget?.username}"? This action cannot be undone.`}
      />

      <ConfirmDialog
        isOpen={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={() => toggleUser(toggleTarget!.id)}
        title={toggleTarget?.is_active ? 'Deactivate User' : 'Activate User'}
        message={`Are you sure you want to ${toggleTarget?.is_active ? 'deactivate' : 'activate'} "${toggleTarget?.username}"?`}
        confirmLabel={toggleTarget?.is_active ? 'Deactivate' : 'Activate'}
        confirmVariant={toggleTarget?.is_active ? 'danger' : 'primary'}
      />
    </div>
  )
}
