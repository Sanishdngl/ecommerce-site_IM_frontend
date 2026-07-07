import { z } from 'zod'

export const AdminUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.enum(['super_admin', 'maintainer', 'reporter']),
})

export const CreateAdminUserSchema = AdminUserSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const AdminLoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export type AdminUserFormType = z.infer<typeof AdminUserSchema>
export type AdminLoginFormType = z.infer<typeof AdminLoginSchema>
