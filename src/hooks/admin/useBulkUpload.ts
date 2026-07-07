import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { adminApi } from '@/lib/adminApi'
import { queryKeys } from '@/lib/queryKeys'

export interface BulkUploadResult {
  total: number
  success: number
  failed: number
  errors: { row: number; message: string }[]
}

export function useBulkUpload() {
  const qc = useQueryClient()
  const [progress, setProgress] = useState(0)

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      setProgress(0)
      const { data } = await adminApi.post<BulkUploadResult>(
        '/api/admin/inventory/bulk-upload',
        formData,
        {
          headers: { 'Content-Type': undefined }, // let axios set multipart boundary; hardcoded value above lacked one
          onUploadProgress: (event) => {
            if (event.total) {
              setProgress(Math.round((event.loaded / event.total) * 100))
            }
          },
        }
      )
      return data
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.all })
      qc.invalidateQueries({ queryKey: queryKeys.categories.all })
    },
  })

  return { ...mutation, progress }
}
