import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { adminApi } from '@/lib/adminApi'
import { queryKeys } from '@/lib/queryKeys'
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  USERS_DEFAULT_SORT,
  DEFAULT_ORDER,
} from '@/constants/queryParams'
import type { AdminUser, PaginatedResponse } from '@/types/api.types'
import type { AdminUserListParams } from '@/lib/queryKeys'

export function useAdminUserList(params: Partial<AdminUserListParams> = {}) {
  const merged: AdminUserListParams = {
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    sort: USERS_DEFAULT_SORT,
    order: DEFAULT_ORDER,
    ...params,
  }

  return useQuery({
    queryKey: queryKeys.adminUsers.list(merged),
    queryFn: async () => {
      const { data } = await adminApi.get<PaginatedResponse<AdminUser>>('/api/admin/users', {
        params: merged,
      })
      return data
    },
    placeholderData: (prev) => prev,
  })
}

export function useAdminUserDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.adminUsers.detail(id),
    queryFn: async () => {
      const { data } = await adminApi.get<AdminUser>(`/api/admin/users/${id}`)
      return data
    },
    enabled: !!id,
  })
}

export function useCreateAdminUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      username: string
      email: string
      password: string
      role: string
    }) => {
      const { data } = await adminApi.post<AdminUser>('/api/admin/users', payload)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminUsers.all })
      toast.success('Admin user created successfully')
    },
  })
}

export function useUpdateAdminUser(id: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      username?: string
      email?: string
      password?: string
      role?: string
    }) => {
      const { data } = await adminApi.patch<AdminUser>(`/api/admin/users/${id}`, payload)
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminUsers.detail(id) })
      qc.invalidateQueries({ queryKey: queryKeys.adminUsers.all })
      toast.success('Admin user updated successfully')
    },
  })
}

export function useDeleteAdminUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await adminApi.delete(`/api/admin/users/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminUsers.all })
      toast.success('Admin user deleted')
    },
  })
}

export function useToggleAdminUser() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const { data } = await adminApi.patch<AdminUser>(`/api/admin/users/${id}/toggle`, {
        isActive,
      })
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminUsers.all })
      toast.success('User status updated')
    },
  })
}
