import { describe, it, expect } from 'vitest'
import { CategorySchema } from '@/lib/schemas/category.schema'

describe('CategorySchema', () => {
  it('accepts a valid category', () => {
    const result = CategorySchema.safeParse({ name: 'Electronics', slug: 'electronics' })
    expect(result.success).toBe(true)
  })

  it('rejects a name under 2 characters', () => {
    const result = CategorySchema.safeParse({ name: 'E', slug: 'electronics' })
    expect(result.success).toBe(false)
  })

  it('rejects a slug with uppercase letters', () => {
    const result = CategorySchema.safeParse({ name: 'Electronics', slug: 'Electronics' })
    expect(result.success).toBe(false)
  })

  it('rejects a slug with spaces', () => {
    const result = CategorySchema.safeParse({ name: 'Electronics', slug: 'electro nics' })
    expect(result.success).toBe(false)
  })
})
