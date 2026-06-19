import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import toast from 'react-hot-toast'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { LOGIN } from '@/constants/routes'
import type { ApiError, Customer } from '@/types/api.types'

export const customerApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

customerApi.interceptors.request.use((config) => {
  const token = useCustomerAuthStore.getState().token
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
  useCustomerAuthStore.getState().logout()
  window.location.href = LOGIN
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

customerApi.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const status = error.response?.status
    const originalRequest = error.config as RetriableConfig | undefined

    if (status === 422) {
      return Promise.reject(error)
    }

    if (status === 401 && originalRequest && !originalRequest._retry) {
      const hasAuthHeader = !!originalRequest.headers.Authorization
      if (!hasAuthHeader) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (token: string) => {
              originalRequest._retry = true
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(customerApi(originalRequest))
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
          customer: Customer
        }>('/api/customer/auth/refresh')

        useCustomerAuthStore.getState().setSession(data.token, data.customer)

        processQueue(null, data.token)

        originalRequest.headers.Authorization = `Bearer ${data.token}`
        return customerApi(originalRequest)
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
