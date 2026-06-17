import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { customerApi } from '@/lib/customerApi'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { HOME } from '@/constants/routes'
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
      const { data } = await customerApi.post<CustomerAuthResponse>(
        '/api/customer/auth/register',
        payload
      )
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
      const { data } = await customerApi.post<CustomerAuthResponse>(
        '/api/customer/auth/login',
        payload
      )
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
      const { data } = await customerApi.post<CustomerAuthResponse>(
        '/api/customer/auth/oauth',
        payload
      )
      return data
    },
    onSuccess: async (data) => {
      login(data)
      await mergePendingCart()
    },
  })
}
