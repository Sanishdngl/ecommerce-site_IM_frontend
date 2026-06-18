import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table } from '@/components/common/Table'
import type { ColumnDef } from '@tanstack/react-table'

interface Row {
  id: string
  name: string
}

const columns: ColumnDef<Row, unknown>[] = [{ header: 'Name', accessorKey: 'name' }]

describe('Table', () => {
  it('renders a skeleton when isLoading is true', () => {
    render(<Table columns={columns} data={[]} isLoading />)
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })

  it('renders EmptyState when data is empty and not loading', () => {
    render(<Table columns={columns} data={[]} isLoading={false} emptyTitle="No rows" />)
    expect(screen.getByText('No rows')).toBeInTheDocument()
  })

  it('renders rows when data is present', () => {
    render(<Table columns={columns} data={[{ id: '1', name: 'Row One' }]} isLoading={false} />)
    expect(screen.getByText('Row One')).toBeInTheDocument()
  })
})
