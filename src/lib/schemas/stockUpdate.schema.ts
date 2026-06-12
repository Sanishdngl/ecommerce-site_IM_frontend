import { z } from 'zod'

export const StockUpdateSchema = z.object({
  delta: z
    .number()
    .int('Delta must be a whole number')
    .refine((v) => v !== 0, { message: 'Delta must be non-zero' }),
  reason: z.string().max(255, 'Reason must be 255 characters or less').optional(),
})

export type StockUpdateFormType = z.infer<typeof StockUpdateSchema>
