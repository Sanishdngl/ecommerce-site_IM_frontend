import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { adminApi } from '@/lib/adminApi'
import { customerApi } from '@/lib/customerApi'
import { queryKeys } from '@/lib/queryKeys'
import {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
  PRODUCTS_DEFAULT_SORT,
  DEFAULT_ORDER,
} from '@/constants/queryParams'
import type { Product, ApiPagination, StockAdjustment } from '@/types/api.types'
import type { ProductListParams } from '@/lib/queryKeys'
import type { ProductPayload } from '@/components/admin/ProductForm'

interface ProductsListResponse {
  products: Product[]
  pagination: ApiPagination
}

interface ProductResponse {
  product: Product
}

export function useAdminProductList(params: Partial<ProductListParams> = {}) {
  const merged: ProductListParams = {
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    sort: PRODUCTS_DEFAULT_SORT,
    order: DEFAULT_ORDER,
    ...params,
  }

  return useQuery({
    queryKey: queryKeys.products.list(merged),
    queryFn: async () => {
      const { data } = await adminApi.get<ProductsListResponse>('/api/admin/inventory/products', {
        params: {
          category_id: merged.categoryId || undefined,
          page: merged.page,
          limit: merged.limit,
          include_inactive: merged.includeInactive || undefined,
        },
      })
      return {
        data: data.products,
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

export function usePublicProductList(
  params: { categorySlug?: string; page?: number; limit?: number } = {}
) {
  return useQuery({
    queryKey: queryKeys.products.list({
      page: params.page ?? DEFAULT_PAGE,
      limit: params.limit ?? DEFAULT_LIMIT,
      sort: PRODUCTS_DEFAULT_SORT,
      order: DEFAULT_ORDER,
      categoryId: params.categorySlug,
    }),
    queryFn: async () => {
      const { data } = await customerApi.get<ProductsListResponse>('/api/products', {
        params: {
          category: params.categorySlug || undefined,
          page: params.page ?? DEFAULT_PAGE,
          limit: params.limit ?? DEFAULT_LIMIT,
        },
      })
      return {
        data: data.products,
        pagination: {
          page: data.pagination.page,
          limit: data.pagination.limit,
          total: data.pagination.total,
          totalPages: Math.ceil(data.pagination.total / data.pagination.limit),
        },
      }
    },
  })
}

export function useProductDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const { data } = await adminApi.get<ProductResponse>(`/api/admin/inventory/products/${id}`)
      return data.product
    },
    enabled: !!id,
  })
}

export function usePublicProductDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(id),
    queryFn: async () => {
      const { data } = await customerApi.get<ProductResponse>(`/api/products/${id}`)
      return data.product
    },
    enabled: !!id,
  })
}

export function useCreateProduct() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: ProductPayload) => {
      const { data } = await adminApi.post<ProductResponse>(
        '/api/admin/inventory/products',
        payload
      )
      return data.product
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.all })
      toast.success('Product created successfully')
    },
  })
}

export function useUpdateProduct(id: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (payload: Partial<ProductPayload> & { is_active?: boolean }) => {
      const { data } = await adminApi.put<ProductResponse>(
        `/api/admin/inventory/products/${id}`,
        payload
      )
      return data.product
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.detail(id) })
      qc.invalidateQueries({ queryKey: queryKeys.products.all })
      toast.success('Product updated successfully')
    },
  })
}

export function useUploadProductImage() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      productId,
      file,
      imageType = 'thumbnail',
    }: {
      productId: string
      file: File
      imageType?: 'thumbnail' | 'list_image'
    }) => {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('image_type', imageType)
      const { data } = await adminApi.post<{ url: string }>(
        `/api/admin/inventory/products/${productId}/image`,
        formData
      )
      return data
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: queryKeys.products.detail(variables.productId) })
      qc.invalidateQueries({ queryKey: queryKeys.products.all })
      toast.success('Product image uploaded')
    },
    onError: () => {
      toast.error('Product saved, but the image failed to upload')
    },
  })
}

export function useToggleProductActive() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { data } = await adminApi.put<ProductResponse>(`/api/admin/inventory/products/${id}`, {
        is_active,
      })
      return data.product
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.all })
      toast.success('Product status updated')
    },
  })
}

export function useDeleteProduct() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      await adminApi.delete(`/api/admin/inventory/products/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.all })
      toast.success('Product deleted')
    },
  })
}

export function useAdjustStock(productId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({ delta, reason }: { delta: number; reason?: string }) => {
      const { data } = await adminApi.patch<StockAdjustment>(
        `/api/admin/inventory/products/${productId}/stock`,
        { delta, reason }
      )
      return data
    },
    onSuccess: (data) => {
      qc.setQueryData<Product>(queryKeys.products.detail(productId), (old) =>
        old ? { ...old, stock_quantity: data.stock_quantity } : old
      )
      qc.setQueriesData<{ data: Product[]; pagination: unknown } | undefined>(
        { queryKey: queryKeys.products.all },
        (old) => {
          if (!old) return old
          return {
            ...old,
            data: old.data.map((p) =>
              p.id === productId ? { ...p, stock_quantity: data.stock_quantity } : p
            ),
          }
        }
      )
      toast.success('Stock updated successfully')
    },
  })
}
