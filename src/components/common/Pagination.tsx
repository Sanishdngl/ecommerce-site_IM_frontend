import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { PaginatedResponse } from '@/types/api.types'

interface Props {
  pagination: PaginatedResponse<unknown>['pagination']
  onPageChange: (page: number) => void
}

export function Pagination({ pagination, onPageChange }: Props) {
  const { page, totalPages } = pagination

  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  const visible = pages.filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)

  // Insert ellipsis markers
  const items: (number | 'ellipsis')[] = []
  let prev = 0
  for (const p of visible) {
    if (p - prev > 1) items.push('ellipsis')
    items.push(p)
    prev = p
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-4">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {items.map((item, idx) =>
        item === 'ellipsis' ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-gray-400">
            …
          </span>
        ) : (
          <button
            key={item}
            onClick={() => onPageChange(item)}
            className={cn(
              'w-8 h-8 rounded text-sm font-medium transition-colors',
              item === page ? 'bg-primary-600 text-white' : 'hover:bg-gray-100 text-gray-700'
            )}
          >
            {item}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
