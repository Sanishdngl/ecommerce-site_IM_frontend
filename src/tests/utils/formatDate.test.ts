import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime } from '@/utils/formatDate'

describe('formatDate', () => {
  it('formats a valid ISO string', () => {
    expect(formatDate('2026-01-15T00:00:00.000Z')).toBe('Jan 15, 2026')
  })

  it('formats an edge-of-year date correctly', () => {
    expect(formatDate('2025-12-31T23:00:00.000Z')).toBe('Jan 1, 2026')
  })
})

describe('formatDateTime', () => {
  it('formats a valid ISO string with time', () => {
    const result = formatDateTime('2026-06-15T14:30:00.000Z')
    expect(result).toContain('Jun 15, 2026')
    expect(result).toMatch(/\d{1,2}:\d{2}\s?(AM|PM)/)
  })
})
