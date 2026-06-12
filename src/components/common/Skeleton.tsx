import { cn } from '@/utils/cn'

interface Props {
  variant?: 'row' | 'card' | 'grid'
  rows?: number
  columns?: number
  className?: string
}

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-gray-200 rounded', className)} />
}

export function Skeleton({ variant = 'row', rows = 5, columns = 4, className }: Props) {
  if (variant === 'grid') {
    return (
      <div
        className={cn(
          'grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4',
          className
        )}
      >
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden border border-gray-100">
            <SkeletonBlock className="h-48 w-full rounded-none" />
            <div className="p-3 space-y-2">
              <SkeletonBlock className="h-4 w-3/4" />
              <SkeletonBlock className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn('space-y-4', className)}>
        <SkeletonBlock className="h-64 w-full" />
        <SkeletonBlock className="h-6 w-2/3" />
        <SkeletonBlock className="h-4 w-1/3" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-full" />
      </div>
    )
  }

  // row variant (default — for tables)
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <SkeletonBlock className="h-4 flex-1" />
          <SkeletonBlock className="h-4 flex-1" />
          <SkeletonBlock className="h-4 w-24" />
          <SkeletonBlock className="h-4 w-16" />
        </div>
      ))}
    </div>
  )
}
