import { describe, it, expect } from 'vitest'
import { CartItemSchema } from '@/lib/schemas/cartItem.schema'

describe('CartItemSchema', () => {
  it('accepts a valid cart item', () => {
    const result = CartItemSchema.safeParse({ productId: 'abc-123', quantity: 2 })
    expect(result.success).toBe(true)
  })

  it('rejects a quantity of 0', () => {
    const result = CartItemSchema.safeParse({ productId: 'abc-123', quantity: 0 })
    expect(result.success).toBe(false)
  })

  it('rejects a quantity above 99', () => {
    const result = CartItemSchema.safeParse({ productId: 'abc-123', quantity: 100 })
    expect(result.success).toBe(false)
  })

  it('rejects an empty productId', () => {
    const result = CartItemSchema.safeParse({ productId: '', quantity: 1 })
    expect(result.success).toBe(false)
  })
})
