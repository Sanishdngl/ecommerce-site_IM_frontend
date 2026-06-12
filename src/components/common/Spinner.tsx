import { cn } from '@/utils/cn'

interface Props {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizes = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-4',
}

export function Spinner({ size = 'md', className }: Props) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        'rounded-full border-gray-300 border-t-primary-600 animate-spin',
        sizes[size],
        className
      )}
    />
  )
}
