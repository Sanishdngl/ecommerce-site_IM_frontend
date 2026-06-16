import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'
import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { ADMIN_LOGIN } from '@/constants/routes'
import { ADMIN_REFRESH_TOKEN_KEY } from '@/constants/storage'
import type { ApiError, AdminUser } from '@/types/api.types'

export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

adminApi.interceptors.request.use((config) => {
  const token = useAdminAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let pendingQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error || !token) reject(error)
    else resolve(token)
  })
  pendingQueue = []
}

function redirectToLogin() {
  useAdminAuthStore.getState().logout()
  window.location.href = ADMIN_LOGIN
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

adminApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const status = error.response?.status
    const originalRequest = error.config as RetriableConfig | undefined

    if (status === 422) {
      return Promise.reject(error)
    }

    if (status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY)

      if (!refreshToken) {
        redirectToLogin()
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token: string) => {
              originalRequest._retry = true
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(adminApi(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await refreshClient.post<{
          token: string
          refresh_token: string
          user: AdminUser
        }>('/api/admin/auth/refresh', { refresh_token: refreshToken })

        useAdminAuthStore.getState().setSession(data.token, data.refresh_token, data.user)

        processQueue(null, data.token)

        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return adminApi(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        redirectToLogin()
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    if (status !== 401) {
      const message = error.response?.data?.message ?? 'Something went wrong. Please try again.'
      toast.error(message)
    }

    return Promise.reject(error)
  }
)
