import { describe, it, expect } from 'vitest'
import { ProductSchema } from '@/lib/schemas/product.schema'

describe('ProductSchema', () => {
  it('accepts valid product data and coerces price/stock to numbers', () => {
    const result = ProductSchema.safeParse({
      name: 'Classic White Tee',
      price: '29.99',
      stock_quantity: '100',
      category_id: 'some-uuid',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.price).toBe(29.99)
      expect(result.data.stock_quantity).toBe(100)
    }
  })

  it('rejects a non-positive price', () => {
    const result = ProductSchema.safeParse({
      name: 'Classic White Tee',
      price: '0',
      stock_quantity: '10',
      category_id: 'some-uuid',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a negative stock quantity', () => {
    const result = ProductSchema.safeParse({
      name: 'Classic White Tee',
      price: '10',
      stock_quantity: '-5',
      category_id: 'some-uuid',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a missing category_id', () => {
    const result = ProductSchema.safeParse({
      name: 'Classic White Tee',
      price: '10',
      stock_quantity: '5',
      category_id: '',
    })
    expect(result.success).toBe(false)
  })
})
