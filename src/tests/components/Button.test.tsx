import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/common/Button'

describe('Button', () => {
  it('renders its label', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('fires onClick when clicked', () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Submit</Button>)
    fireEvent.click(screen.getByText('Submit'))
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('shows a spinner and disables the button when loading', () => {
    render(<Button loading>Submit</Button>)
    const button = screen.getByRole('button')
    expect(button).toBeDisabled()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('does not fire onClick when disabled', () => {
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Submit
      </Button>
    )
    fireEvent.click(screen.getByText('Submit'))
    expect(onClick).not.toHaveBeenCalled()
  })
})
