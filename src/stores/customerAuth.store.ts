import { create } from 'zustand'
import type { Customer, CustomerAuthResponse } from '@/types/api.types'
import { CUSTOMER_REFRESH_TOKEN_KEY } from '@/constants/storage'
import { useCartStore } from './cart.store'
import { customerApi } from '@/lib/customerApi'
import type { CartResponse } from '@/types/api.types'

interface CustomerAuthState {
  token: string | null
  customer: Customer | null
}

interface CustomerAuthActions {
  login: (response: CustomerAuthResponse) => void
  logout: () => void
  setSession: (token: string, refreshToken: string, customer: Customer) => void
  setToken: (token: string, refreshToken?: string) => void
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
    localStorage.setItem(CUSTOMER_REFRESH_TOKEN_KEY, response.refresh_token)
    set({
      token: response.token,
      customer: response.customer,
    })
  },

  logout: () => {
    localStorage.removeItem(CUSTOMER_REFRESH_TOKEN_KEY)
    set(initialState)
  },

  setSession: (token: string, refreshToken: string, customer: Customer) => {
    localStorage.setItem(CUSTOMER_REFRESH_TOKEN_KEY, refreshToken)
    set({ token, customer })
  },

  setToken: (token: string, refreshToken?: string) => {
    if (refreshToken) {
      localStorage.setItem(CUSTOMER_REFRESH_TOKEN_KEY, refreshToken)
    }
    set({ token })
  },

  isAuthenticated: () => {
    return get().token !== null
  },

  mergePendingCart: async () => {
    const guestItems = useCartStore.getState().items
    if (guestItems.length === 0) return

    try {
      for (const item of guestItems) {
        await customerApi.post<CartResponse>('/api/customer/cart', {
          product_id: item.productId,
          quantity: item.quantity,
        })
      }
      useCartStore.getState().clearCart()
    } catch {
      console.error('[customerAuth] Failed to merge guest cart')
    }
  },
}))
