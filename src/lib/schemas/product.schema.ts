import { z } from 'zod'

export const ProductSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Price must be greater than 0'),
  stock_quantity: z.coerce
    .number()
    .int('Stock must be a whole number')
    .min(0, 'Stock cannot be negative'),
  category_id: z.string().min(1, 'Category is required'),
  image: z.instanceof(File).optional(),
})

export type ProductFormType = z.infer<typeof ProductSchema>
