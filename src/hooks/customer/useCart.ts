import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { customerApi } from '@/lib/customerApi'
import { queryKeys } from '@/lib/queryKeys'
import type { CartItem, CartResponse, GuestCartItem } from '@/types/api.types'

export function useCartQuery() {
  return useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: async () => {
      const { data } = await customerApi.get<CartResponse>('/api/customer/cart')
      return data.items
    },
  })
}

export function useAddToCart() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { product_id: string; quantity: number }) => {
      const { data } = await customerApi.post<CartResponse>('/api/customer/cart', payload)
      return data.items
    },
    onSuccess: (items) => {
      qc.setQueryData(queryKeys.cart.all, items)
      toast.success('Added to cart')
    },
  })
}

export function useUpdateCartItem(productId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (quantity: number) => {
      const { data } = await customerApi.put<CartResponse>(`/api/customer/cart/${productId}`, {
        quantity,
      })
      return data.items
    },
    onMutate: async (quantity: number) => {
      await qc.cancelQueries({ queryKey: queryKeys.cart.all })
      const previous = qc.getQueryData<CartItem[]>(queryKeys.cart.all)

      qc.setQueryData<CartItem[]>(queryKeys.cart.all, (old) =>
        old?.map((item) => (item.product_id === productId ? { ...item, quantity } : item))
      )

      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        qc.setQueryData(queryKeys.cart.all, context.previous)
      }
      toast.error('Failed to update quantity')
    },
    onSuccess: (items) => {
      qc.setQueryData(queryKeys.cart.all, items)
    },
  })
}

export function useRemoveCartItem() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await customerApi.delete<CartResponse>(`/api/customer/cart/${productId}`)
      return data.items
    },
    onSuccess: (items) => {
      qc.setQueryData(queryKeys.cart.all, items)
      toast.success('Removed from cart')
    },
  })
}

export function useMergeCart() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (guestItems: GuestCartItem[]) => {
      const results = await Promise.all(
        guestItems.map((item) =>
          customerApi.post<CartResponse>('/api/customer/cart', {
            product_id: item.productId,
            quantity: item.quantity,
          })
        )
      )
      return results[results.length - 1]?.data.items ?? []
    },
    onSuccess: (items) => {
      qc.setQueryData(queryKeys.cart.all, items)
    },
  })
}
