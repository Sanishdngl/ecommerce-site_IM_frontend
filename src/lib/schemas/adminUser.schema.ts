import { z } from 'zod'

export const AdminUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  role: z.enum(['super_admin', 'maintainer', 'viewer']),
})

export const CreateAdminUserSchema = AdminUserSchema.extend({
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type AdminUserFormType = z.infer<typeof AdminUserSchema>
export type CreateAdminUserFormType = z.infer<typeof CreateAdminUserSchema>
