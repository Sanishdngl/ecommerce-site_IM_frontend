import { describe, it, expect } from 'vitest'
import { queryKeys } from '@/lib/queryKeys'

describe('queryKeys', () => {
  it('produces distinct keys for different list params', () => {
    const keyA = queryKeys.products.list({
      page: 1,
      limit: 20,
      sort: 'createdAt',
      order: 'desc',
    })
    const keyB = queryKeys.products.list({
      page: 2,
      limit: 20,
      sort: 'createdAt',
      order: 'desc',
    })
    expect(keyA).not.toEqual(keyB)
  })

  it('produces identical keys for identical params', () => {
    const keyA = queryKeys.categories.list({
      page: 1,
      limit: 20,
      sort: 'name',
      order: 'asc',
    })
    const keyB = queryKeys.categories.list({
      page: 1,
      limit: 20,
      sort: 'name',
      order: 'asc',
    })
    expect(keyA).toEqual(keyB)
  })

  it('produces distinct detail keys for different ids', () => {
    expect(queryKeys.adminUsers.detail('abc')).not.toEqual(queryKeys.adminUsers.detail('xyz'))
  })

  it('cart and profile expose stable "all" keys with no params', () => {
    expect(queryKeys.cart.all).toEqual(['cart'])
    expect(queryKeys.profile.all).toEqual(['profile'])
  })
})
