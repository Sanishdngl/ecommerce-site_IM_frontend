import { z } from 'zod'

export const CartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z
    .number()
    .int('Quantity must be a whole number')
    .min(1, 'Quantity must be at least 1')
    .max(99, 'Quantity cannot exceed 99'),
})

export type CartItemFormType = z.infer<typeof CartItemSchema>
