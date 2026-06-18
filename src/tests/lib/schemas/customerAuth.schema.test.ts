import { describe, it, expect } from 'vitest'
import { LoginSchema, RegisterSchema } from '@/lib/schemas/customerAuth.schema'

describe('LoginSchema', () => {
  it('accepts valid credentials', () => {
    const result = LoginSchema.safeParse({ email: 'a@b.com', password: 'password123' })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = LoginSchema.safeParse({ email: 'not-an-email', password: 'password123' })
    expect(result.success).toBe(false)
  })

  it('rejects a password under 8 characters', () => {
    const result = LoginSchema.safeParse({ email: 'a@b.com', password: 'short' })
    expect(result.success).toBe(false)
  })
})

describe('RegisterSchema', () => {
  it('accepts valid matching passwords', () => {
    const result = RegisterSchema.safeParse({
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = RegisterSchema.safeParse({
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'different123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Passwords do not match')
    }
  })

  it('rejects a missing first name', () => {
    const result = RegisterSchema.safeParse({
      first_name: '',
      last_name: 'Smith',
      email: 'jane@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    })
    expect(result.success).toBe(false)
  })
})
