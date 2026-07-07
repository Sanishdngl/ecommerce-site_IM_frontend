import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { adminApi } from '@/lib/adminApi'
import { queryKeys } from '@/lib/queryKeys'
import type { AdminUser, ApiPagination } from '@/types/api.types'
import type { AdminUserListParams } from '@/lib/queryKeys'
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  USERS_DEFAULT_SORT,
  DEFAULT_ORDER,
} from '@/constants/queryParams'

interface AdminUsersListResponse {
  users: AdminUser[]
  pagination: ApiPagination
}

interface AdminUserResponse {
  user: AdminUser
}

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
      const { data } = await adminApi.get<AdminUsersListResponse>('/api/admin/users', {
        params: { page: merged.page, limit: merged.limit },
      })
      return {
        data: data.users,
        pagination: {
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: Math.ceil(data.pagination.total / data.pagination.limit),
        },
      }
    },
    placeholderData: (prev) => prev,
  })
}

export function useAdminUserDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.adminUsers.detail(id),
    queryFn: async () => {
      const { data } = await adminApi.get<AdminUserResponse>(`/api/admin/users/${id}`)
      return data.user
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
      const { data } = await adminApi.post<AdminUserResponse>('/api/admin/users', payload)
      return data.user
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
      const { data } = await adminApi.put<AdminUserResponse>(`/api/admin/users/${id}`, payload)
      return data.user
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
    mutationFn: async (id: string) => {
      await adminApi.patch(`/api/admin/users/${id}/status`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.adminUsers.all })
      toast.success('User status updated')
    },
  })
}
