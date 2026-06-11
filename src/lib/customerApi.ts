import axios, { type AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { LOGIN } from '@/constants/routes'
import type { ApiError } from '@/types/api.types'

export const customerApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

customerApi.interceptors.request.use((config) => {
  const token = useCustomerAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

customerApi.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const status = error.response?.status

    if (status === 401) {
      useCustomerAuthStore.getState().logout()
      window.location.href = LOGIN
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
