import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StockUpdateModal } from '@/components/admin/StockUpdateModal'
import { adminApi } from '@/lib/adminApi'

vi.mock('@/lib/adminApi', () => ({
  adminApi: { patch: vi.fn() },
}))

function renderWithQueryClient(children: React.ReactNode) {
  const queryClient = new QueryClient()
  return render(<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>)
}

describe('StockUpdateModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('blocks submission when delta is 0', async () => {
    renderWithQueryClient(
      <StockUpdateModal isOpen onClose={() => {}} productId="p1" currentQuantity={50} />
    )

    fireEvent.click(screen.getByText('Save Adjustment'))

    await waitFor(() => {
      expect(screen.getByText('Delta must be non-zero')).toBeInTheDocument()
    })
    expect(adminApi.patch).not.toHaveBeenCalled()
  })

  it('submits a valid delta and closes the modal', async () => {
    vi.mocked(adminApi.patch).mockResolvedValue({
      data: { product_id: 'p1', stock_quantity: 60 },
    })
    const onClose = vi.fn()

    renderWithQueryClient(
      <StockUpdateModal isOpen onClose={onClose} productId="p1" currentQuantity={50} />
    )

    const deltaInput = screen.getByRole('spinbutton')
    fireEvent.change(deltaInput, { target: { value: '10' } })
    fireEvent.click(screen.getByText('Save Adjustment'))

    await waitFor(() => {
      expect(adminApi.patch).toHaveBeenCalledWith('/api/admin/inventory/products/p1/stock', {
        delta: 10,
      })
    })
  })
})
