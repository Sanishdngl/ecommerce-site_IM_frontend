import type { SortOrder } from '@/constants/queryParams'

export interface AdminUserListParams {
  page: number
  limit: number
  sort: string
  order: SortOrder
}

export interface CategoryListParams {
  page: number
  limit: number
  sort: string
  order: SortOrder
}

export interface ProductListParams {
  page: number
  limit: number
  sort: string
  order: SortOrder
  categoryId?: string
}

export interface AuditLogListParams {
  page: number
  limit: number
  entityType?: string
  action?: string
}

export const queryKeys = {
  adminUsers: {
    all: ['adminUsers'] as const,
    list: (params: AdminUserListParams) => ['adminUsers', 'list', params] as const,
    detail: (id: string) => ['adminUsers', 'detail', id] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: (params: CategoryListParams) => ['categories', 'list', params] as const,
    detail: (id: string) => ['categories', 'detail', id] as const,
  },
  products: {
    all: ['products'] as const,
    list: (params: ProductListParams) => ['products', 'list', params] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
  },
  cart: {
    all: ['cart'] as const,
  },
  profile: {
    all: ['profile'] as const,
  },
  system: {
    dashboardStats: ['system', 'dashboardStats'] as const,
    health: ['system', 'health'] as const,
    auditLogs: (params: AuditLogListParams) => ['system', 'auditLogs', params] as const,
  },
}
