import { describe, it, expect, beforeEach } from 'vitest'
import { useCartStore } from '@/stores/cart.store'

const item1 = { productId: 'p1', name: 'Tee', price: '19.99', imageUrl: null, quantity: 1 }
const item2 = { productId: 'p2', name: 'Hoodie', price: '39.99', imageUrl: null, quantity: 1 }

describe('cart.store', () => {
  beforeEach(() => {
    localStorage.clear()
    useCartStore.setState({ items: [], guestCartMerged: false })
  })

  it('adds a new item', () => {
    useCartStore.getState().addItem(item1)
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].productId).toBe('p1')
  })

  it('merges quantity when adding a duplicate productId', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().addItem({ ...item1, quantity: 2 })
    const items = useCartStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].quantity).toBe(3)
  })

  it('removes an item by productId', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().addItem(item2)
    useCartStore.getState().removeItem('p1')
    const items = useCartStore.getState().items
    expect(items).toHaveLength(1)
    expect(items[0].productId).toBe('p2')
  })

  it('updateQuantity to 0 removes the item', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().updateQuantity('p1', 0)
    expect(useCartStore.getState().items).toHaveLength(0)
  })

  it('updateQuantity updates an existing item', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().updateQuantity('p1', 5)
    expect(useCartStore.getState().items[0].quantity).toBe(5)
  })

  it('clearCart empties items and sets guestCartMerged true', () => {
    useCartStore.getState().addItem(item1)
    useCartStore.getState().clearCart()
    expect(useCartStore.getState().items).toHaveLength(0)
    expect(useCartStore.getState().guestCartMerged).toBe(true)
  })

  it('hydrateFromStorage restores items persisted to localStorage', () => {
    useCartStore.getState().addItem(item1)
    // Reset in-memory state but leave localStorage intact
    useCartStore.setState({ items: [], guestCartMerged: false })
    useCartStore.getState().hydrateFromStorage()
    expect(useCartStore.getState().items).toHaveLength(1)
    expect(useCartStore.getState().items[0].productId).toBe('p1')
  })
})
