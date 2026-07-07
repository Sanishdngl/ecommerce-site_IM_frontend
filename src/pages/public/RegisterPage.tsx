import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { useRegister } from '@/hooks/customer/useCustomerAuth'
import { AuthForm } from '@/components/public/AuthForm'
import { CUSTOMER_PROFILE } from '@/constants/routes'
import type { RegisterFormType } from '@/lib/schemas/customerAuth.schema'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function RegisterPage() {
  const navigate = useNavigate()
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated())
  const { mutate: registerCustomer, isPending } = useRegister()

  useEffect(() => {
    if (isAuthenticated) navigate(CUSTOMER_PROFILE, { replace: true })
  }, [isAuthenticated, navigate])

  const handleSubmit = (data: RegisterFormType) => {
    registerCustomer({
      email: data.email,
      password: data.password,
      first_name: data.first_name,
      last_name: data.last_name,
    })
  }

  useDocumentTitle('Create Account')

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-stamp text-xs tracking-widest text-ink/50 mb-2">ACCOUNT</p>
          <h1 className="font-display text-3xl text-ink">Open an account</h1>
          <p className="text-sm text-ink/60 mt-1">Track orders and see stock before it's gone</p>
        </div>
        <AuthForm mode="register" onSubmit={handleSubmit} isPending={isPending} />
      </div>
    </div>
  )
}
