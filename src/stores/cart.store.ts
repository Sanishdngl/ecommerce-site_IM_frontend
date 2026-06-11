import { create } from 'zustand'
import type { GuestCartItem } from '@/types/api.types'
import { GUEST_CART_KEY } from '@/constants/storage'

interface CartState {
  items: GuestCartItem[]
  guestCartMerged: boolean
}

interface CartActions {
  hydrateFromStorage: () => void
  addItem: (item: GuestCartItem) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
}

type CartStore = CartState & CartActions

function persist(items: GuestCartItem[]): void {
  try {
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items))
  } catch {
    // ignore storage errors
  }
}

export const useCartStore = create<CartStore>()((set, get) => ({
  items: [],
  guestCartMerged: false,

  hydrateFromStorage: () => {
    try {
      const raw = localStorage.getItem(GUEST_CART_KEY)
      if (raw) {
        const items = JSON.parse(raw) as GuestCartItem[]
        set({ items })
      }
    } catch {
      // ignore malformed data
    }
  },

  addItem: (item: GuestCartItem) => {
    const existing = get().items.find((i) => i.productId === item.productId)
    let updated: GuestCartItem[]

    if (existing) {
      updated = get().items.map((i) =>
        i.productId === item.productId ? { ...i, quantity: i.quantity + item.quantity } : i
      )
    } else {
      updated = [...get().items, item]
    }

    persist(updated)
    set({ items: updated })
  },

  removeItem: (productId: string) => {
    const updated = get().items.filter((i) => i.productId !== productId)
    persist(updated)
    set({ items: updated })
  },

  updateQuantity: (productId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(productId)
      return
    }
    const updated = get().items.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    persist(updated)
    set({ items: updated })
  },

  clearCart: () => {
    localStorage.removeItem(GUEST_CART_KEY)
    set({ items: [], guestCartMerged: true })
  },
}))
