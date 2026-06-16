import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useCartStore } from '@/stores/cart.store'
import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import { ADMIN_REFRESH_TOKEN_KEY, CUSTOMER_REFRESH_TOKEN_KEY } from '@/constants/storage'
import type { AdminUser, Customer } from '@/types/api.types'
import './index.css'
import App from './App'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: 1,
    },
  },
})

// Hydrate guest cart from localStorage before first render
useCartStore.getState().hydrateFromStorage()

async function restoreSession() {
  const apiUrl = import.meta.env.VITE_API_URL

  const adminRefresh = localStorage.getItem(ADMIN_REFRESH_TOKEN_KEY)
  if (adminRefresh) {
    try {
      const res = await fetch(`${apiUrl}/api/admin/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: adminRefresh }),
      })
      if (!res.ok) throw new Error('refresh failed')
      const data: { token: string; refresh_token: string; user: AdminUser } = await res.json()
      useAdminAuthStore.getState().setSession(data.token, data.refresh_token, data.user)
    } catch {
      localStorage.removeItem(ADMIN_REFRESH_TOKEN_KEY)
      useAdminAuthStore.getState().logout()
    }
  }

  const customerRefresh = localStorage.getItem(CUSTOMER_REFRESH_TOKEN_KEY)
  if (customerRefresh) {
    try {
      const res = await fetch(`${apiUrl}/api/customer/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: customerRefresh }),
      })
      if (!res.ok) throw new Error('refresh failed')
      const data: { token: string; refresh_token: string; customer: Customer } = await res.json()
      useCustomerAuthStore.getState().setSession(data.token, data.refresh_token, data.customer)
    } catch {
      localStorage.removeItem(CUSTOMER_REFRESH_TOKEN_KEY)
      useCustomerAuthStore.getState().logout()
    }
  }
}

restoreSession()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster position="top-right" />
    </QueryClientProvider>
  </StrictMode>
)
