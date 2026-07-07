import { create } from 'zustand'
import type { Customer, CustomerAuthResponse } from '@/types/api.types'
import { useCartStore } from './cart.store'
import { customerApi } from '@/lib/customerApi'
import { queryClient } from '@/lib/queryClient'
import { queryKeys } from '@/lib/queryKeys'
import type { CartResponse } from '@/types/api.types'

interface CustomerAuthState {
  token: string | null
  customer: Customer | null
}

interface CustomerAuthActions {
  login: (response: CustomerAuthResponse) => void
  logout: () => void
  setSession: (token: string, customer: Customer) => void
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
    set({
      token: response.token,
      customer: response.customer,
    })
  },

  logout: () => {
    set(initialState)
    queryClient.removeQueries({ queryKey: queryKeys.cart.all })
    queryClient.removeQueries({ queryKey: queryKeys.profile.all })
  },

  setSession: (token: string, customer: Customer) => {
    set({ token, customer })
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
      await queryClient.invalidateQueries({ queryKey: queryKeys.cart.all })
    } catch {
      console.error('[customerAuth] Failed to merge guest cart')
    }
  },
}))
