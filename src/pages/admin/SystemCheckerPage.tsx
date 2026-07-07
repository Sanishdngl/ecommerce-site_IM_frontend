import { useState } from 'react'
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react'
import type { ColumnDef } from '@tanstack/react-table'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'
import { useSystemHealth, useAuditLogs } from '@/hooks/admin/useSystem'
import { Table } from '@/components/common/Table'
import { Select } from '@/components/common/Select'
import { Button } from '@/components/common/Button'
import { formatDateTime } from '@/utils/formatDate'
import type { AuditLogEntry } from '@/types/api.types'
import { cn } from '@/utils/cn'

const ENTITY_TYPE_OPTIONS = [
  { value: '', label: 'All entities' },
  { value: 'product', label: 'Product' },
  { value: 'category', label: 'Category' },
  { value: 'admin_user', label: 'Admin user' },
]

const ACTION_OPTIONS = [
  { value: '', label: 'All actions' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
]

const ACTION_STYLES: Record<string, string> = {
  create: 'bg-green-100 text-green-700',
  update: 'bg-blue-100 text-blue-700',
  delete: 'bg-red-100 text-red-700',
}

function HealthCard({
  label,
  status,
}: {
  label: string
  status?: { ok: boolean; message: string } | null
}) {
  const ok = status?.ok
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      {ok === undefined ? (
        <RefreshCw className="w-6 h-6 text-gray-300 animate-spin" />
      ) : ok ? (
        <CheckCircle2 className="w-6 h-6 text-green-600" />
      ) : (
        <XCircle className="w-6 h-6 text-red-600" />
      )}
      <div className="min-w-0">
        <p className="text-sm text-gray-500">{label}</p>
        <p className={cn('text-sm font-semibold truncate', ok ? 'text-green-700' : 'text-red-700')}>
          {status ? (ok ? 'Operational' : status.message) : 'Checking…'}
        </p>
      </div>
    </div>
  )
}

export default function SystemCheckerPage() {
  useDocumentTitle('System Checker')

  const [page, setPage] = useState(1)
  const [entityType, setEntityType] = useState('')
  const [action, setAction] = useState('')

  const { data: health, isFetching: healthFetching, refetch: refetchHealth } = useSystemHealth()
  const { data: logs, isLoading: logsLoading } = useAuditLogs({
    page,
    limit: 20,
    entityType: entityType || undefined,
    action: action || undefined,
  })

  const columns: ColumnDef<AuditLogEntry, unknown>[] = [
    {
      header: 'When',
      accessorKey: 'created_at',
      cell: ({ row }) => (
        <span className="text-gray-600">{formatDateTime(row.original.created_at)}</span>
      ),
    },
    {
      header: 'Action',
      accessorKey: 'action',
      cell: ({ row }) => (
        <span
          className={cn(
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize',
            ACTION_STYLES[row.original.action] ?? 'bg-gray-100 text-gray-600'
          )}
        >
          {row.original.action}
        </span>
      ),
    },
    {
      header: 'Entity',
      accessorKey: 'entity_type',
      cell: ({ row }) => (
        <span className="capitalize">
          {row.original.entity_type.replace('_', ' ')}{' '}
          <span className="text-gray-400">#{row.original.entity_id.slice(0, 8)}</span>
        </span>
      ),
    },
    {
      header: 'By',
      accessorKey: 'performed_by_username',
      cell: ({ row }) =>
        row.original.performed_by_username || <span className="text-gray-400">deleted admin</span>,
    },
    {
      header: 'IP',
      accessorKey: 'ip_address',
      cell: ({ row }) => <span className="text-gray-500">{row.original.ip_address || '—'}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Checker</h1>
          <p className="text-gray-500 mt-1">Service health and recent admin activity</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => refetchHealth()}
          loading={healthFetching}
        >
          <RefreshCw size={16} />
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <HealthCard label="Gateway" status={health?.gateway} />
        <HealthCard label="Admin Service" status={health?.admin} />
        <HealthCard label="Inventory Service" status={health?.inventory} />
        <HealthCard label="Customer Service" status={health?.customer} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h2 className="text-base font-semibold text-gray-700">Audit Log</h2>
          <div className="flex gap-3">
            <Select
              options={ENTITY_TYPE_OPTIONS}
              value={entityType}
              onChange={(e) => {
                setEntityType(e.target.value)
                setPage(1)
              }}
              className="w-40"
            />
            <Select
              options={ACTION_OPTIONS}
              value={action}
              onChange={(e) => {
                setAction(e.target.value)
                setPage(1)
              }}
              className="w-40"
            />
          </div>
        </div>

        <Table
          columns={columns}
          data={logs?.data ?? []}
          isLoading={logsLoading}
          pagination={logs?.pagination}
          onPageChange={setPage}
          emptyTitle="No audit log entries found"
          emptyDescription="Try adjusting the entity or action filters."
        />
      </div>
    </div>
  )
}
