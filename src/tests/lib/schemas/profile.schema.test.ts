import { describe, it, expect } from 'vitest'
import { ProfileSchema } from '@/lib/schemas/profile.schema'

describe('ProfileSchema', () => {
  it('accepts valid names', () => {
    const result = ProfileSchema.safeParse({ first_name: 'Jane', last_name: 'Smith' })
    expect(result.success).toBe(true)
  })

  it('rejects an empty first name', () => {
    const result = ProfileSchema.safeParse({ first_name: '', last_name: 'Smith' })
    expect(result.success).toBe(false)
  })

  it('rejects a first name over 50 characters', () => {
    const result = ProfileSchema.safeParse({ first_name: 'a'.repeat(51), last_name: 'Smith' })
    expect(result.success).toBe(false)
  })
})
