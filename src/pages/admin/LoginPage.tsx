import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { useAdminLogin } from '@/hooks/admin/useAdminAuth'
import { AdminLoginSchema, type AdminLoginFormType } from '@/lib/schemas/adminUser.schema'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { ADMIN_DASHBOARD } from '@/constants/routes'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated())
  const { mutate: login, isPending } = useAdminLogin()

  useDocumentTitle('Admin Login')

  useEffect(() => {
    if (isAuthenticated) navigate(ADMIN_DASHBOARD, { replace: true })
  }, [isAuthenticated, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormType>({
    resolver: zodResolver(AdminLoginSchema),
  })

  const onSubmit = (data: AdminLoginFormType) => {
    login({ username: data.username, password: data.password! })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">ShopAdmin</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Username"
            type="text"
            placeholder="admin"
            error={errors.username?.message}
            {...register('username')}
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <Button type="submit" className="w-full mt-2" loading={isPending}>
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
