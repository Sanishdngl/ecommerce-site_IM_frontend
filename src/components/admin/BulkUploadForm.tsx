import { useState } from 'react'
import { FileDropzone } from '@/components/common/FileDropzone'
import { Button } from '@/components/common/Button'
import { useBulkUpload, type BulkUploadResult } from '@/hooks/admin/useBulkUpload'
import { CheckCircle2, XCircle, FileSpreadsheet, Images } from 'lucide-react'

export function BulkUploadForm() {
  const { mutate: upload, isPending, progress } = useBulkUpload()
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [excelError, setExcelError] = useState<string | null>(null)
  const [result, setResult] = useState<BulkUploadResult | null>(null)

  const handleExcelSelect = (file: File) => {
    if (!file.name.endsWith('.xlsx')) {
      setExcelError('File must be an .xlsx spreadsheet')
      setExcelFile(null)
      return
    }
    setExcelError(null)
    setExcelFile(file)
  }

  const handleImageArchiveSelect = (file: File) => {
    setImageFiles([file])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!excelFile) {
      setExcelError('Please select an .xlsx file')
      return
    }

    const formData = new FormData()
    formData.append('excel', excelFile)
    imageFiles.forEach((img) => formData.append('images', img))

    setResult(null)
    upload(formData, {
      onSuccess: (data) => setResult(data),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <FileSpreadsheet size={16} />
          Product Spreadsheet (.xlsx) — required
        </div>
        <FileDropzone accept=".xlsx" maxSizeMb={10} onFileSelect={handleExcelSelect} />
        {excelError && <p className="text-xs text-red-600">{excelError}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Images size={16} />
          Product Images (.zip) — optional
        </div>
        <FileDropzone
          accept=".zip,image/*"
          maxSizeMb={50}
          onFileSelect={handleImageArchiveSelect}
        />
      </div>

      {isPending && (
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Uploading…</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-600 transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {result && (
        <div className="rounded-lg border border-gray-200 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-900">Upload Summary</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-2xl font-bold text-gray-900">{result.total}</p>
              <p className="text-xs text-gray-500 mt-1">Total Rows</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3">
              <p className="text-2xl font-bold text-green-700 flex items-center justify-center gap-1">
                <CheckCircle2 size={18} />
                {result.success}
              </p>
              <p className="text-xs text-green-600 mt-1">Created</p>
            </div>
            <div className="rounded-lg bg-red-50 p-3">
              <p className="text-2xl font-bold text-red-700 flex items-center justify-center gap-1">
                <XCircle size={18} />
                {result.failed}
              </p>
              <p className="text-xs text-red-600 mt-1">Failed</p>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700">Errors</p>
              <ul className="text-xs text-red-600 space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((err, idx) => (
                  <li key={idx}>
                    Row {err.row}: {err.message}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <Button type="submit" className="w-full" loading={isPending} disabled={!excelFile}>
        Upload Products
      </Button>
    </form>
  )
}
