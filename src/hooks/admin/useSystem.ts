import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/adminApi'
import { queryKeys, type AuditLogListParams } from '@/lib/queryKeys'
import { DEFAULT_PAGE, DEFAULT_LIMIT } from '@/constants/queryParams'
import type { DashboardStats, SystemHealth, AuditLogEntry, ApiPagination } from '@/types/api.types'

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.system.dashboardStats,
    queryFn: async () => {
      const { data } = await adminApi.get<DashboardStats>('/api/admin/system/dashboard-stats')
      return data
    },
  })
}

export function useSystemHealth() {
  return useQuery({
    queryKey: queryKeys.system.health,
    queryFn: async () => {
      const { data } = await adminApi.get<SystemHealth>('/api/admin/system/health')
      return data
    },
    refetchInterval: 15_000,
    staleTime: 10_000,
  })
}

interface AuditLogsResponse {
  logs: AuditLogEntry[]
  pagination: ApiPagination
}

export function useAuditLogs(params: Partial<AuditLogListParams> = {}) {
  const merged: AuditLogListParams = {
    page: DEFAULT_PAGE,
    limit: DEFAULT_LIMIT,
    ...params,
  }

  return useQuery({
    queryKey: queryKeys.system.auditLogs(merged),
    queryFn: async () => {
      const { data } = await adminApi.get<AuditLogsResponse>('/api/admin/system/audit-logs', {
        params: {
          page: merged.page,
          limit: merged.limit,
          entity_type: merged.entityType || undefined,
          action: merged.action || undefined,
        },
      })
      return {
        data: data.logs,
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
