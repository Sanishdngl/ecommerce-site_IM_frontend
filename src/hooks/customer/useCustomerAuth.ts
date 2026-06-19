import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { customerApi } from '@/lib/customerApi'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { HOME, LOGIN } from '@/constants/routes'
import { getDeviceId, getDevicePixelRatio } from '@/lib/deviceId'
import type { CustomerAuthResponse } from '@/types/api.types'

interface RegisterPayload {
  email: string
  password: string
  first_name: string
  last_name: string
}

interface LoginPayload {
  email: string
  password: string
}

interface OAuthPayload {
  provider: 'google'
  token: string
}

export function useRegister() {
  const navigate = useNavigate()
  const login = useCustomerAuthStore((s) => s.login)
  const mergePendingCart = useCustomerAuthStore((s) => s.mergePendingCart)

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await customerApi.post<CustomerAuthResponse>('/api/customer/auth/register', {
        ...payload,
        device_id: getDeviceId(),
        device_pixel_ratio: getDevicePixelRatio(),
      })
      return data
    },
    onSuccess: async (data) => {
      login(data)
      await mergePendingCart()
      toast.success(`Welcome, ${data.customer.first_name}!`)
      navigate(HOME, { replace: true })
    },
  })
}

export function useLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useCustomerAuthStore((s) => s.login)
  const mergePendingCart = useCustomerAuthStore((s) => s.mergePendingCart)

  return useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const { data } = await customerApi.post<CustomerAuthResponse>('/api/customer/auth/login', {
        ...payload,
        device_id: getDeviceId(),
        device_pixel_ratio: getDevicePixelRatio(),
      })
      return data
    },
    onSuccess: async (data) => {
      login(data)
      await mergePendingCart()
      toast.success(`Welcome back, ${data.customer.first_name}!`)
      const from = (location.state as { from?: Location })?.from?.pathname
      navigate(from ?? HOME, { replace: true })
    },
  })
}

export function useOAuth() {
  const login = useCustomerAuthStore((s) => s.login)
  const mergePendingCart = useCustomerAuthStore((s) => s.mergePendingCart)

  return useMutation({
    mutationFn: async (payload: OAuthPayload) => {
      const { data } = await customerApi.post<CustomerAuthResponse>('/api/customer/auth/oauth', {
        ...payload,
        device_id: getDeviceId(),
        device_pixel_ratio: getDevicePixelRatio(),
      })
      return data
    },
    onSuccess: async (data) => {
      login(data)
      await mergePendingCart()
    },
  })
}

export function useCustomerLogout() {
  const navigate = useNavigate()
  const logout = useCustomerAuthStore((s) => s.logout)

  return useMutation({
    mutationFn: async () => {
      await customerApi.post('/api/customer/auth/logout')
    },
    onSuccess: () => {
      logout()
      navigate(LOGIN, { replace: true })
    },
    onError: () => {
      logout()
      navigate(LOGIN, { replace: true })
    },
  })
}