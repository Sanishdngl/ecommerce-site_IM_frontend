import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AdminUserSchema,
  CreateAdminUserSchema,
  type AdminUserFormType,
} from '@/lib/schemas/adminUser.schema'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Button } from '@/components/common/Button'

const roleOptions = [
  { value: 'maintainer', label: 'Maintainer' },
  { value: 'reporter', label: 'Reporter' },
]

interface Props {
  mode: 'create' | 'edit'
  defaultValues?: Partial<AdminUserFormType>
  onSubmit: (data: AdminUserFormType) => void
  isPending?: boolean
}

export function AdminUserForm({ mode, defaultValues, onSubmit, isPending }: Props) {
  const schema = mode === 'create' ? CreateAdminUserSchema : AdminUserSchema

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminUserFormType>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  useEffect(() => {
    if (defaultValues) reset(defaultValues)
  }, [defaultValues, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Username"
        placeholder="johndoe"
        error={errors.username?.message}
        {...register('username')}
      />
      <Input
        label="Email"
        type="email"
        placeholder="john@example.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label={mode === 'edit' ? 'Password (leave blank to keep current)' : 'Password'}
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />
      <Select
        label="Role"
        options={roleOptions}
        error={errors.role?.message}
        {...register('role')}
      />
      <div className="pt-2">
        <Button type="submit" className="w-full" loading={isPending}>
          {mode === 'create' ? 'Create User' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
