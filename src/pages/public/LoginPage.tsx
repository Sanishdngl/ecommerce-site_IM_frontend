import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { useLogin } from '@/hooks/customer/useCustomerAuth'
import { AuthForm } from '@/components/public/AuthForm'
import { CUSTOMER_PROFILE } from '@/constants/routes'
import type { LoginFormType } from '@/lib/schemas/customerAuth.schema'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function LoginPage() {
  const navigate = useNavigate()
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated())
  const { mutate: login, isPending } = useLogin()

  useEffect(() => {
    if (isAuthenticated) navigate(CUSTOMER_PROFILE, { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = (data: LoginFormType) => {
    login(data)
  }

  useDocumentTitle('Sign In')

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-stamp text-xs tracking-widest text-ink/50 mb-2">ACCOUNT</p>
          <h1 className="font-display text-3xl text-ink">Welcome back</h1>
          <p className="text-sm text-ink/60 mt-1">Sign in to pick up where you left off</p>
        </div>
        <AuthForm mode="login" onSubmit={handleSubmit} isPending={isPending} />
      </div>
    </div>
  )
}
