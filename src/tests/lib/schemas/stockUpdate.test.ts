import { describe, it, expect } from 'vitest'
import { StockUpdateSchema } from '@/lib/schemas/stockUpdate.schema'

describe('StockUpdateSchema', () => {
  it('accepts a positive delta', () => {
    const result = StockUpdateSchema.safeParse({ delta: 10 })
    expect(result.success).toBe(true)
  })

  it('accepts a negative delta', () => {
    const result = StockUpdateSchema.safeParse({ delta: -5 })
    expect(result.success).toBe(true)
  })

  it('rejects delta of 0', () => {
    const result = StockUpdateSchema.safeParse({ delta: 0 })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Delta must be non-zero')
    }
  })

  it('rejects a non-integer delta', () => {
    const result = StockUpdateSchema.safeParse({ delta: 1.5 })
    expect(result.success).toBe(false)
  })

  it('rejects a reason longer than 255 characters', () => {
    const result = StockUpdateSchema.safeParse({ delta: 5, reason: 'a'.repeat(256) })
    expect(result.success).toBe(false)
  })
})
