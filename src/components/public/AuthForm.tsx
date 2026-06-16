import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import {
  LoginSchema,
  RegisterSchema,
  type LoginFormType,
  type RegisterFormType,
} from '@/lib/schemas/customerAuth.schema'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { REGISTER, LOGIN } from '@/constants/routes'
import { OAUTH_RETURN_TO_KEY } from '@/constants/storage'
import { useLocation } from 'react-router-dom'

type Props =
  | {
      mode: 'login'
      onSubmit: (data: LoginFormType) => void
      isPending?: boolean
    }
  | {
      mode: 'register'
      onSubmit: (data: RegisterFormType) => void
      isPending?: boolean
    }

const oauthEnabled = import.meta.env.VITE_ENABLE_OAUTH === 'true'

function buildGoogleAuthUrl(): string {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  })
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export function AuthForm(props: Props) {
  const { mode, isPending } = props
  const location = useLocation()

  const schema = mode === 'login' ? LoginSchema : RegisterSchema

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormType | RegisterFormType>({
    resolver: zodResolver(schema as never),
  })

  const handleGoogleClick = () => {
    sessionStorage.setItem(OAUTH_RETURN_TO_KEY, location.pathname)
    window.location.href = buildGoogleAuthUrl()
  }

  const onValidSubmit = handleSubmit((data) => {
    if (mode === 'login') {
      props.onSubmit(data as LoginFormType)
    } else {
      props.onSubmit(data as RegisterFormType)
    }
  })

  const registerErrors = errors as Partial<Record<keyof RegisterFormType, { message?: string }>>

  return (
    <div className="space-y-5">
      <form onSubmit={onValidSubmit} className="space-y-4">
        {mode === 'register' && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Jane"
              error={registerErrors.first_name?.message}
              {...register('first_name' as keyof RegisterFormType)}
            />
            <Input
              label="Last Name"
              placeholder="Smith"
              error={registerErrors.last_name?.message}
              {...register('last_name' as keyof RegisterFormType)}
            />
          </div>
        )}

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        {mode === 'register' && (
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            error={registerErrors.confirmPassword?.message}
            {...register('confirmPassword' as keyof RegisterFormType)}
          />
        )}

        <Button type="submit" className="w-full" loading={isPending}>
          {mode === 'login' ? 'Sign in' : 'Create account'}
        </Button>
      </form>

      {oauthEnabled && (
        <>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-400">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleClick}
            className="w-full flex items-center justify-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </>
      )}

      <p className="text-center text-sm text-gray-500">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link to={REGISTER} className="text-primary-600 font-medium hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link to={LOGIN} className="text-primary-600 font-medium hover:underline">
              Sign in
            </Link>
          </>
        )}
      </p>
    </div>
  )
}
