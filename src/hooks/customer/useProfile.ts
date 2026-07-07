import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { customerApi } from '@/lib/customerApi'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { queryKeys } from '@/lib/queryKeys'
import type { Customer } from '@/types/api.types'

interface CustomerResponse {
  customer: Customer
}

export function useProfileQuery() {
  const token = useCustomerAuthStore((s) => s.token)

  return useQuery({
    queryKey: queryKeys.profile.all,
    queryFn: async () => {
      const { data } = await customerApi.get<CustomerResponse>('/api/customer/profile')
      return data.customer
    },
    enabled: !!token,
  })
}

export function useUpdateProfile() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { first_name?: string; last_name?: string }) => {
      const { data } = await customerApi.put<CustomerResponse>('/api/customer/profile', payload)
      return data.customer
    },
    onSuccess: (customer) => {
      qc.setQueryData(queryKeys.profile.all, customer)
      useCustomerAuthStore.setState({ customer })
      toast.success('Profile updated successfully')
    },
  })
}
