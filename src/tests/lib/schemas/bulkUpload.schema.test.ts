import { describe, it, expect } from 'vitest'
import { BulkUploadSchema } from '@/lib/schemas/bulkUpload.schema'

function makeFile(
  name: string,
  type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
) {
  return new File(['content'], name, { type })
}

describe('BulkUploadSchema', () => {
  it('accepts a valid .xlsx file', () => {
    const result = BulkUploadSchema.safeParse({ file: makeFile('products.xlsx') })
    expect(result.success).toBe(true)
  })

  it('rejects a non-.xlsx file', () => {
    const result = BulkUploadSchema.safeParse({ file: makeFile('products.csv') })
    expect(result.success).toBe(false)
  })

  it('rejects a missing file', () => {
    const result = BulkUploadSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
