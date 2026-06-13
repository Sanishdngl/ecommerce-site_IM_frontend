import { useParams, useNavigate } from 'react-router-dom'
import { useAdminUserDetail, useUpdateAdminUser } from '@/hooks/admin/useAdminUsers'
import { AdminUserForm } from '@/components/admin/AdminUserForm'
import { Skeleton } from '@/components/common/Skeleton'
import { ADMIN_USERS } from '@/constants/routes'
import type { AdminUserFormType } from '@/lib/schemas/adminUser.schema'

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: user, isLoading } = useAdminUserDetail(id!)
  const { mutate: updateUser, isPending } = useUpdateAdminUser(id!)

  const handleSubmit = (data: AdminUserFormType) => {
    const payload: Record<string, string> = {
      username: data.username,
      email: data.email,
      role: data.role,
    }
    if (data.password) payload.password = data.password

    updateUser(payload, {
      onSuccess: () => navigate(ADMIN_USERS),
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-lg">
        <Skeleton variant="row" rows={4} />
      </div>
    )
  }

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Admin User</h1>
        <p className="text-gray-500 text-sm mt-1">Update administrator account details</p>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <AdminUserForm
          mode="edit"
          defaultValues={{
            username: user?.username,
            email: user?.email,
            role: user?.role,
          }}
          onSubmit={handleSubmit}
          isPending={isPending}
        />
      </div>
    </div>
  )
}
