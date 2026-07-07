import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { useCartStore } from '@/stores/cart.store'
import { useAdminAuthStore } from '@/stores/adminAuth.store'
import { useCustomerAuthStore } from '@/stores/customerAuth.store'
import type { AdminUser, Customer } from '@/types/api.types'
import { queryClient } from '@/lib/queryClient'
import './index.css'
import App from './App'

// Hydrate guest cart from localStorage before first render
useCartStore.getState().hydrateFromStorage()

const apiUrl = import.meta.env.VITE_API_URL

async function restoreSession() {
  const path = window.location.pathname

  if (path.startsWith('/admin')) {
    try {
      const res = await fetch(`${apiUrl}/api/admin/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        const data: { token: string; user: AdminUser } = await res.json()
        useAdminAuthStore.getState().setSession(data.token, data.user)
      }
    } catch {
      // No valid admin session — stays logged out
    }
    return
  }

  // attempt customer refresh on all other routes
  try {
    const res = await fetch(`${apiUrl}/api/customer/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) {
      const data: { token: string; customer: Customer } = await res.json()
      useCustomerAuthStore.getState().setSession(data.token, data.customer)
    }
  } catch {
    // No valid customer session — stays logged out
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
