import { z } from 'zod'

export const BulkUploadSchema = z.object({
  file: z
    .instanceof(File, { message: 'Please select a file' })
    .refine((f) => f.name.endsWith('.xlsx'), { message: 'File must be an .xlsx spreadsheet' }),
  images: z.instanceof(File).optional(),
})

export type BulkUploadFormType = z.infer<typeof BulkUploadSchema>
