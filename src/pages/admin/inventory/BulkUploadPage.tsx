import { Download } from 'lucide-react'
import { BulkUploadForm } from '@/components/admin/BulkUploadForm'
import { useDocumentTitle } from '@/hooks/useDocumentTitle'

export default function BulkUploadPage() {
  useDocumentTitle('Bulk Upload')
  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Bulk Upload</h1>
        <p className="mt-1 text-sm text-gray-500">
          Upload multiple products at once via Excel spreadsheet
        </p>
      </div>

      <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-gray-700">Need the template?</p>
            <p className="mt-0.5 text-xs text-gray-500">
              Download the spreadsheet format with required columns
            </p>
          </div>

          <a
            href="/templates/product-bulk-upload-template.xlsx"
            download
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <Download size={16} />
            <span>Template</span>
          </a>
        </div>

        <BulkUploadForm />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Spreadsheet Columns</h2>

        <table className="w-full text-left text-xs">
          <thead className="border-b border-gray-200 text-gray-500">
            <tr>
              <th className="py-2 pr-4">Column</th>
              <th className="py-2 pr-4">Required</th>
              <th className="py-2">Notes</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100 text-gray-600">
            <tr>
              <td className="py-2 pr-4 font-mono">name</td>
              <td className="py-2 pr-4">Yes</td>
              <td className="py-2">Product name</td>
            </tr>

            <tr>
              <td className="py-2 pr-4 font-mono">description</td>
              <td className="py-2 pr-4">No</td>
              <td className="py-2">Optional</td>
            </tr>

            <tr>
              <td className="py-2 pr-4 font-mono">price</td>
              <td className="py-2 pr-4">Yes</td>
              <td className="py-2">Positive decimal</td>
            </tr>

            <tr>
              <td className="py-2 pr-4 font-mono">stock_quantity</td>
              <td className="py-2 pr-4">Yes</td>
              <td className="py-2">Non-negative integer</td>
            </tr>

            <tr>
              <td className="py-2 pr-4 font-mono">category_slug</td>
              <td className="py-2 pr-4">Yes</td>
              <td className="py-2">Must match an existing category</td>
            </tr>

            <tr>
              <td className="py-2 pr-4 font-mono">thumbnail_filename</td>
              <td className="py-2 pr-4">No</td>
              <td className="py-2">Filename of uploaded image</td>
            </tr>

            <tr>
              <td className="py-2 pr-4 font-mono">list_image_filename</td>
              <td className="py-2 pr-4">No</td>
              <td className="py-2">Filename of uploaded image</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
