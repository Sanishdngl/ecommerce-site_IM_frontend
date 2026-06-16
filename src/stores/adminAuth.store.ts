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
  setSession: (token: string, refreshToken: string, user: AdminUser) => void
  setToken: (token: string, refreshToken?: string) => void
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
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, response.refresh_token)
    set({
      token: response.token,
      user: response.user,
      role: response.user.role,
    })
  },

  logout: () => {
    localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY)
    set(initialState)
  },

  setSession: (token: string, refreshToken: string, user: AdminUser) => {
    localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, refreshToken)
    set({ token, user, role: user.role })
  },

  setToken: (token: string, refreshToken?: string) => {
    if (refreshToken) {
      localStorage.setItem(ADMIN_REFRESH_TOKEN_KEY, refreshToken)
    }
    set({ token })
  },

  isAuthenticated: () => {
    return get().token !== null
  },
}))
