import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from '@tanstack/react-table'
import { Skeleton } from './Skeleton'
import { EmptyState } from './EmptyState'
import { Pagination } from './Pagination'
import type { PaginatedResponse } from '@/types/api.types'

interface Props<T> {
  columns: ColumnDef<T, unknown>[]
  data: T[]
  isLoading?: boolean
  pagination?: PaginatedResponse<T>['pagination']
  onPageChange?: (page: number) => void
  emptyTitle?: string
  emptyDescription?: string
}

export function Table<T>({
  columns,
  data,
  isLoading,
  pagination,
  onPageChange,
  emptyTitle = 'No results found',
  emptyDescription,
}: Props<T>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  if (isLoading) {
    return <Skeleton variant="row" rows={6} />
  }

  if (!data.length) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />
  }

  return (
    <div className="overflow-x-auto border border-hairline bg-white">
      <table className="w-full text-sm text-left">
        <thead className="bg-console border-b border-hairline">
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id}>
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 font-admin font-medium text-graphite/70 text-xs uppercase tracking-wide whitespace-nowrap"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-hairline">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-console/60 transition-colors">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-4 py-3 text-graphite">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && onPageChange && (
        <div className="px-4 py-3 border-t border-hairline">
          <Pagination
            pagination={pagination}
            onPageChange={onPageChange}
            accentClassName="bg-signal text-white"
          />
        </div>
      )}
    </div>
  )
}
