import { cn } from '@/utils/cn'

type Variant = 'role' | 'active' | 'inactive' | 'low-stock' | 'out-of-stock'

interface Props {
  variant: Variant
  children: React.ReactNode
  className?: string
}

const variants: Record<Variant, string> = {
  role: 'bg-blue-100 text-blue-700',
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  'low-stock': 'bg-amber-100 text-amber-700',
  'out-of-stock': 'bg-red-100 text-red-700',
}

export function Badge({ variant, children, className }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
