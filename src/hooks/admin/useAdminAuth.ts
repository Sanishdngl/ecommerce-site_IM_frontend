import { useMutation } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { adminApi } from '@/lib/adminApi'
import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { ADMIN_DASHBOARD, ADMIN_LOGIN } from '@/constants/routes'
import { getDeviceId, getDevicePixelRatio } from '@/lib/deviceId'
import type { AdminAuthResponse } from '@/types/api.types'

interface LoginCredentials {
  username: string
  password: string
}

export function useAdminLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const login = useAdminAuthStore((s) => s.login)

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const { data } = await adminApi.post<AdminAuthResponse>('/api/admin/auth/login', {
        ...credentials,
        device_id: getDeviceId(),
        device_pixel_ratio: getDevicePixelRatio(),
      })
      return data
    },
    onSuccess: (data) => {
      login(data)
      toast.success(`Welcome back, ${data.user.username}!`)
      const from = (location.state as { from?: Location })?.from?.pathname
      navigate(from ?? ADMIN_DASHBOARD, { replace: true })
    },
  })
}

export function useAdminLogout() {
  const navigate = useNavigate()
  const logout = useAdminAuthStore((s) => s.logout)

  return useMutation({
    mutationFn: async () => {
      await adminApi.post('/api/admin/auth/logout')
    },
    onSuccess: () => {
      logout()
      navigate(ADMIN_LOGIN, { replace: true })
    },
    onError: () => {
      logout()
      navigate(ADMIN_LOGIN, { replace: true })
    },
  })
}
