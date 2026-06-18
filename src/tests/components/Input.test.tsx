import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from '@/components/common/Input'

describe('Input', () => {
  it('renders the error message when error prop is set', () => {
    render(<Input label="Email" error="Invalid email" />)
    expect(screen.getByText('Invalid email')).toBeInTheDocument()
  })

  it('does not render an error container when error is absent', () => {
    render(<Input label="Email" />)
    expect(screen.queryByText('Invalid email')).not.toBeInTheDocument()
  })

  it('renders the label correctly', () => {
    render(<Input label="Username" />)
    expect(screen.getByText('Username')).toBeInTheDocument()
  })
})
