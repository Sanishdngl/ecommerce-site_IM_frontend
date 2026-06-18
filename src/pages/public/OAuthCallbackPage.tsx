import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useOAuth } from '@/hooks/customer/useCustomerAuth'
import { Spinner } from '@/components/common/Spinner'
import { CUSTOMER_PROFILE, LOGIN } from '@/constants/routes'
import { OAUTH_RETURN_TO_KEY } from '@/constants/storage'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function OAuthCallbackPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { mutate: oauthLogin } = useOAuth()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    const code = searchParams.get('code')

    if (!code) {
      navigate(`${LOGIN}?error=oauth_failed`, { replace: true })
      return
    }

    oauthLogin(
      { provider: 'google', token: code },
      {
        onSuccess: () => {
          const returnTo = sessionStorage.getItem(OAUTH_RETURN_TO_KEY)
          sessionStorage.removeItem(OAUTH_RETURN_TO_KEY)
          navigate(returnTo || CUSTOMER_PROFILE, { replace: true })
        },
        onError: () => {
          navigate(`${LOGIN}?error=oauth_failed`, { replace: true })
        },
      }
    )
  }, [searchParams, oauthLogin, navigate])

  useDocumentTitle('Signing In')

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500">Completing sign in…</p>
    </div>
  )
}
