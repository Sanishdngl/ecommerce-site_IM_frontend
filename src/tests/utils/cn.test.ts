import { describe, it, expect } from 'vitest'
import { cn } from '@/utils/cn'

describe('cn', () => {
  it('merges multiple class strings', () => {
    expect(cn('px-2', 'py-4')).toBe('px-2 py-4')
  })

  it('resolves conflicting Tailwind classes, keeping the last one', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4')
  })

  it('ignores falsy values', () => {
    expect(cn('text-sm', false, null, undefined, 'font-bold')).toBe('text-sm font-bold')
  })
})
