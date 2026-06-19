import { create } from 'zustand'
import type { AdminAuthResponse, AdminRole, AdminUser } from '@/types/api.types'

interface AdminAuthState {
  token: string | null
  user: AdminUser | null
  role: AdminRole | null
}

interface AdminAuthActions {
  login: (response: AdminAuthResponse) => void
  logout: () => void
  setSession: (token: string, user: AdminUser) => void
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
    set({
      token: response.token,
      user: response.user,
      role: response.user.role,
    })
  },

  logout: () => {
    set(initialState)
  },

  setSession: (token: string, user: AdminUser) => {
    set({ token, user, role: user.role })
  },

  setToken: (token: string) => {
    set({ token })
  },

  isAuthenticated: () => {
    return get().token !== null
  },
}))
