import { create } from 'zustand'
import type { AdminAuthResponse, AdminRole, AdminUser } from '@/types/api.types'
import { ADMIN_REFRESH_TOKEN_KEY } from '@/constants/storage'

interface AdminAuthState {
  token: string | null
  user: AdminUser | null
  role: AdminRole | null
}

interface AdminAuthActions {
  login: (response: AdminAuthResponse) => void
  logout: () => void
  setToken: (token: string) => void
  isAuthenticated: () => boolean
}

type AdminAuthStore = AdminAuthState & AdminAuthActions

const initialState: AdminAuthState = {
  token: null,
  user: null,
  role: null,
}

export const useAdminAuthStore = create<AdminAuthStore>()((set, get) => ({
  ...initialState,

  login: (response: AdminAuthResponse) => {
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, response.refreshToken)
    set({
      token: response.accessToken,
      user: response.user,
      role: response.user.role,
    })
  },

  logout: () => {
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY)
    set(initialState)
  },

  setToken: (token: string) => {
    set({ token })
  },

  isAuthenticated: () => {
    return get().token !== null
  },
}))
