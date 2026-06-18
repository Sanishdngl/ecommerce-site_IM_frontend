import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Pagination } from '@/components/common/Pagination'

describe('Pagination', () => {
  it('disables the previous button on page 1', () => {
    render(
      <Pagination
        pagination={{ page: 1, limit: 20, total: 100, totalPages: 5 }}
        onPageChange={() => {}}
      />
    )
    expect(screen.getByLabelText('Previous page')).toBeDisabled()
  })

  it('disables the next button on the last page', () => {
    render(
      <Pagination
        pagination={{ page: 5, limit: 20, total: 100, totalPages: 5 }}
        onPageChange={() => {}}
      />
    )
    expect(screen.getByLabelText('Next page')).toBeDisabled()
  })

  it('calls onPageChange with the correct page number', () => {
    const onPageChange = vi.fn()
    render(
      <Pagination
        pagination={{ page: 2, limit: 20, total: 100, totalPages: 5 }}
        onPageChange={onPageChange}
      />
    )
    fireEvent.click(screen.getByLabelText('Next page'))
    expect(onPageChange).toHaveBeenCalledWith(3)
  })

  it('renders nothing when totalPages is 1 or less', () => {
    const { container } = render(
      <Pagination
        pagination={{ page: 1, limit: 20, total: 5, totalPages: 1 }}
        onPageChange={() => {}}
      />
    )
    expect(container).toBeEmptyDOMElement()
  })
})