import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useProfileQuery, useUpdateProfile } from '@/hooks/customer/useProfile'
import { ProfileSchema, type ProfileFormType } from '@/lib/schemas/profile.schema'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { Skeleton } from '@/components/common/Skeleton'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function ProfilePage() {
  const { data: customer, isLoading } = useProfileQuery()
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormType>({
    resolver: zodResolver(ProfileSchema),
  })

  useEffect(() => {
    if (customer) {
      reset({
        first_name: customer.first_name,
        last_name: customer.last_name,
      })
    }
  }, [customer, reset])

  const onSubmit = (data: ProfileFormType) => {
    updateProfile(data)
  }

  useDocumentTitle('Your Profile')

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto px-4 sm:px-6 py-8">
        <Skeleton variant="row" rows={4} />
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account details</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={customer?.email ?? ''}
            disabled
            helperText="Email cannot be changed"
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Jane"
              error={errors.first_name?.message}
              {...register('first_name')}
            />
            <Input
              label="Last Name"
              placeholder="Smith"
              error={errors.last_name?.message}
              {...register('last_name')}
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full" loading={isPending}>
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
