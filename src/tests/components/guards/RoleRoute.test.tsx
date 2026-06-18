import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { RoleRoute } from '@/components/guards/RoleRoute'
import { useAdminAuthStore } from '@/stores/adminAuth.store'

function renderWithRole(role: 'super_admin' | 'maintainer' | 'reporter' | null) {
  useAdminAuthStore.setState({ token: 'fake', user: null, role })

  return render(
    <MemoryRouter initialEntries={['/admin/users']}>
      <Routes>
        <Route
          path="/admin/users"
          element={
            <RoleRoute allowedRoles={['super_admin']}>
              <div>Users Page</div>
            </RoleRoute>
          }
        />
        <Route path="/admin/dashboard" element={<div>Dashboard Page</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('RoleRoute', () => {
  beforeEach(() => {
    useAdminAuthStore.setState({ token: null, user: null, role: null })
  })

  it('redirects a reporter role away from a super_admin-only route', () => {
    renderWithRole('reporter')
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument()
    expect(screen.queryByText('Users Page')).not.toBeInTheDocument()
  })

  it('renders the route content for an allowed role', () => {
    renderWithRole('super_admin')
    expect(screen.getByText('Users Page')).toBeInTheDocument()
  })
})
