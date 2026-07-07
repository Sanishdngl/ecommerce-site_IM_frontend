import { describe, it, expect } from 'vitest'
import { formatCurrency } from '@/utils/formatCurrency'

describe('formatCurrency', () => {
  it('formats zero correctly', () => {
    expect(formatCurrency(0)).toBe('NPR 0.00')
  })

  it('formats a positive decimal correctly', () => {
    expect(formatCurrency(29.99)).toBe('NPR 29.99')
  })

  it('formats large numbers with thousands separators (Nepali digit grouping)', () => {
    expect(formatCurrency(1234567.5)).toBe('NPR 12,34,567.50')
  })

  it('formats with a different currency code', () => {
    expect(formatCurrency(10, 'EUR', 'en-US')).toBe('€10.00')
  })
})
