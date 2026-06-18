import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { useLogin } from '@/hooks/customer/useCustomerAuth'
import { AuthForm } from '@/components/public/AuthForm'
import { CUSTOMER_PROFILE } from '@/constants/routes'
import type { LoginFormType } from '@/lib/schemas/customerAuth.schema'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated())
  const { mutate: login, isPending } = useLogin()

  useEffect(() => {
    if (isAuthenticated) navigate(CUSTOMER_PROFILE, { replace: true })
  }, [isAuthenticated, navigate])

  useEffect(() => {
    if (searchParams.get('error') === 'oauth_failed') {
      toast.error('Google sign-in failed. Please try again.')
    }
  }, [searchParams])

  const handleSubmit = (data: LoginFormType) => {
    login(data)
  }

  useDocumentTitle('Sign In')

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>
        <AuthForm mode="login" onSubmit={handleSubmit} isPending={isPending} />
      </div>
    </div>
  )
}
