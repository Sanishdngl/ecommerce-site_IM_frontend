import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Modal } from '@/components/common/Modal'

describe('Modal', () => {
  it('renders children when isOpen is true', () => {
    render(
      <Modal isOpen onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.getByText('Modal content')).toBeInTheDocument()
  })

  it('renders nothing when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    expect(screen.queryByText('Modal content')).not.toBeInTheDocument()
  })

  it('calls onClose when the backdrop is clicked', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    fireEvent.click(screen.getByRole('dialog').previousSibling as Element)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose on Escape key press', () => {
    const onClose = vi.fn()
    render(
      <Modal isOpen onClose={onClose} title="Test Modal">
        <p>Modal content</p>
      </Modal>
    )
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledOnce()
  })
})
