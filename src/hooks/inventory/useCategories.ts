import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { adminApi } from '@/lib/adminApi'
import { customerApi } from '@/lib/customerApi'
import { queryKeys } from '@/lib/queryKeys'
import { CATEGORIES_DEFAULT_SORT, DEFAULT_ORDER } from '@/constants/queryParams'
import type { Category } from '@/types/api.types'

interface CategoriesListResponse {
  categories: Category[]
}

interface CategoryResponse {
  category: Category
}

export function useAdminCategoryList() {
  return useQuery({
    queryKey: queryKeys.categories.list({
      page: 1,
      limit: 100,
      sort: CATEGORIES_DEFAULT_SORT,
      order: DEFAULT_ORDER,
    }),
    queryFn: async () => {
      const { data } = await adminApi.get<CategoriesListResponse>('/api/admin/inventory/categories')
      return data.categories
    },
  })
}

export function usePublicCategoryList() {
  return useQuery({
    queryKey: queryKeys.categories.list({
      page: 1,
      limit: 100,
      sort: CATEGORIES_DEFAULT_SORT,
      order: DEFAULT_ORDER,
    }),
    queryFn: async () => {
      const { data } = await customerApi.get<CategoriesListResponse>('/api/categories')
      return data.categories
    },
  })
}

export function useCategoryDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.detail(id),
    queryFn: async () => {
      const { data } = await adminApi.get<CategoryResponse>(`/api/admin/inventory/categories/${id}`)
      return data.category
    },
    enabled: !!id,
  })
}

export function useCreateCategory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { name: string; slug: string }) => {
      const { data } = await adminApi.post<CategoryResponse>(
        '/api/admin/inventory/categories',
        payload
      )
      return data.category
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
      toast.success('Category created successfully')
    },
  })
}

export function useUpdateCategory(id: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { name: string; slug: string }) => {
      const { data } = await adminApi.put<CategoryResponse>(
        `/api/admin/inventory/categories/${id}`,
        payload
      )
      return data.category
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.detail(id) })
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
      toast.success('Category updated successfully')
    },
  })
}

export function useDeleteCategory() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await adminApi.delete(`/api/admin/inventory/categories/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
      toast.success('Category deleted')
    },
    onError: () => {
      toast.error('Failed to delete category')
    },
  })
}
