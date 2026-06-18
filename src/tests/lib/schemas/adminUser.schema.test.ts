import { describe, it, expect } from 'vitest'
import {
  AdminUserSchema,
  CreateAdminUserSchema,
  AdminLoginSchema,
} from '@/lib/schemas/adminUser.schema'

describe('AdminUserSchema', () => {
  it('accepts valid data', () => {
    const result = AdminUserSchema.safeParse({
      username: 'johndoe',
      email: 'john@example.com',
      role: 'maintainer',
    })
    expect(result.success).toBe(true)
  })

  it('rejects username under 3 characters', () => {
    const result = AdminUserSchema.safeParse({
      username: 'jo',
      email: 'john@example.com',
      role: 'maintainer',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Username must be at least 3 characters')
    }
  })

  it('rejects an invalid email', () => {
    const result = AdminUserSchema.safeParse({
      username: 'johndoe',
      email: 'not-an-email',
      role: 'maintainer',
    })
    expect(result.success).toBe(false)
  })
})

describe('CreateAdminUserSchema', () => {
  it('requires password on create', () => {
    const result = CreateAdminUserSchema.safeParse({
      username: 'johndoe',
      email: 'john@example.com',
      role: 'maintainer',
    })
    expect(result.success).toBe(false)
  })

  it('accepts a valid create payload', () => {
    const result = CreateAdminUserSchema.safeParse({
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password123',
      role: 'maintainer',
    })
    expect(result.success).toBe(true)
  })
})

describe('AdminLoginSchema', () => {
  it('rejects an empty username', () => {
    const result = AdminLoginSchema.safeParse({ username: '', password: 'x' })
    expect(result.success).toBe(false)
  })

  it('accepts valid login credentials', () => {
    const result = AdminLoginSchema.safeParse({ username: 'admin', password: 'secret' })
    expect(result.success).toBe(true)
  })
})
