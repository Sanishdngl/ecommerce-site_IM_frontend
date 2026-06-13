import { create } from 'zustand'
import type { Customer, CustomerAuthResponse } from '@/types/api.types'
import { CUSTOMER_REFRESH_TOKEN_KEY } from '@/constants/storage'

interface CustomerAuthState {
  token: string | null
  customer: Customer | null
}

interface CustomerAuthActions {
  login: (response: CustomerAuthResponse) => void
  logout: () => void
  setToken: (token: string) => void
  isAuthenticated: () => boolean
  mergePendingCart: () => Promise<void>
}

type CustomerAuthStore = CustomerAuthState & CustomerAuthActions

const initialState: CustomerAuthState = {
  token: null,
  customer: null,
}

export const useCustomerAuthStore = create<CustomerAuthStore>()((set, get) => ({
  ...initialState,

  login: (response: CustomerAuthResponse) => {
    localStorage.setItem(CUSTOMER_REFRESH_TOKEN_KEY, response.token)
    set({
      token: response.token,
      customer: response.customer,
    })
  },

  logout: () => {
    localStorage.removeItem(CUSTOMER_REFRESH_TOKEN_KEY)
    set(initialState)
  },

  setToken: (token: string) => {
    set({ token })
  },

  isAuthenticated: () => {
    return get().token !== null
  },

  mergePendingCart: async () => {
    console.warn('[customerAuth] mergePendingCart: not yet implemented (Phase 15)')
  },
}))
