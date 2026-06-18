import { useNavigate } from 'react-router-dom'
import { useCreateAdminUser } from '@/hooks/admin/useAdminUsers'
import { AdminUserForm } from '@/components/admin/AdminUserForm'
import { ADMIN_USERS } from '@/constants/routes'
import type { AdminUserFormType } from '@/lib/schemas/adminUser.schema'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function CreateUserPage() {
  const navigate = useNavigate()
  const { mutate: createUser, isPending } = useCreateAdminUser()

  const handleSubmit = (data: AdminUserFormType) => {
    createUser(
      {
        username: data.username,
        email: data.email,
        password: data.password!,
        role: data.role,
      },
      {
        onSuccess: () => navigate(ADMIN_USERS),
      }
    )
  }

  useDocumentTitle('Create Admin User')

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Admin User</h1>
        <p className="text-gray-500 text-sm mt-1">Add a new administrator account</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <AdminUserForm mode="create" onSubmit={handleSubmit} isPending={isPending} />
      </div>
    </div>
  )
}
