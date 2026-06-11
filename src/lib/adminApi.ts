import axios, { type AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { ADMIN_LOGIN } from '@/constants/routes'
import type { ApiError } from '@/types/api.types'

export const adminApi = axios.create({
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

adminApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status

    if (status === 401) {
      useAdminAuthStore.getState().logout()
      window.location.href = ADMIN_LOGIN
      return Promise.reject(error)
    }

    if (status === 422) {
      return Promise.reject(error)
    }

    const message = error.response?.data?.message ?? 'Something went wrong. Please try again.'
    toast.error(message)

    return Promise.reject(error)
  }
)
