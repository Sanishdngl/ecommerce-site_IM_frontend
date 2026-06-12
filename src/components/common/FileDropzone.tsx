import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Props {
  accept: string
  maxSizeMb: number
  onFileSelect: (file: File) => void
  label?: string
}

export function FileDropzone({ accept, maxSizeMb, onFileSelect, label }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [selected, setSelected] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)

  const validate = (file: File): string | null => {
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `File exceeds ${maxSizeMb}MB limit`
    }
    return null
  }

  const handleFile = (file: File) => {
    const err = validate(file)
    if (err) {
      setError(err)
      setSelected(null)
      return
    }
    setError(null)
    setSelected(file)
    onFileSelect(file)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg p-8 cursor-pointer transition-colors',
          dragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
        )}
      >
        <UploadCloud className="w-8 h-8 text-gray-400" />
        {selected ? (
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">{selected.name}</p>
            <p className="text-xs text-gray-500">{(selected.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Drag & drop or <span className="text-primary-600 font-medium">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">Max {maxSizeMb}MB</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onInputChange}
          className="hidden"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
