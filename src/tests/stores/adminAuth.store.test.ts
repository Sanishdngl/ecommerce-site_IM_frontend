import { describe, it, expect, beforeEach } from 'vitest'
import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { ADMIN_REFRESH_TOKEN_KEY } from '@/constants/storage'
import type { AdminAuthResponse } from '@/types/api.types'

const mockResponse: AdminAuthResponse = {
  token: 'access-token-123',
  refresh_token: 'refresh-token-456',
  user: {
    id: '1',
    username: 'superadmin',
    email: 'admin@example.com',
    role: 'super_admin',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
}

describe('adminAuth.store', () => {
  beforeEach(() => {
    localStorage.clear()
    useAdminAuthStore.setState({ token: null, user: null, role: null })
  })

  it('login stores token, user, role, and persists refresh token', () => {
    useAdminAuthStore.getState().login(mockResponse)
    const state = useAdminAuthStore.getState()
    expect(state.token).toBe('access-token-123')
    expect(state.user?.username).toBe('superadmin')
    expect(state.role).toBe('super_admin')
    expect(localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY)).toBe('refresh-token-456')
  })

  it('isAuthenticated reflects token presence', () => {
    expect(useAdminAuthStore.getState().isAuthenticated()).toBe(false)
    useAdminAuthStore.getState().login(mockResponse)
    expect(useAdminAuthStore.getState().isAuthenticated()).toBe(true)
  })

  it('logout clears state and removes refresh token from localStorage', () => {
    useAdminAuthStore.getState().login(mockResponse)
    useAdminAuthStore.getState().logout()
    const state = useAdminAuthStore.getState()
    expect(state.token).toBeNull()
    expect(state.user).toBeNull()
    expect(localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY)).toBeNull()
  })

  it('setSession restores token, user, and role together (used by refresh flow)', () => {
    useAdminAuthStore.getState().setSession('new-token', 'new-refresh', mockResponse.user)
    const state = useAdminAuthStore.getState()
    expect(state.token).toBe('new-token')
    expect(state.role).toBe('super_admin')
    expect(localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY)).toBe('new-refresh')
  })
})
