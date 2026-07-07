import { useRef, useState } from 'react'
import { UploadCloud } from 'lucide-react'
import { cn } from '@/utils/cn'

interface Props {
  accept: string
  maxSizeMb: number
  onFileSelect?: (file: File) => void
  onFilesSelect?: (files: File[]) => void
  multiple?: boolean
  label?: string
}

export function FileDropzone({
  accept,
  maxSizeMb,
  onFileSelect,
  onFilesSelect,
  multiple = false,
  label,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)
  const [selected, setSelected] = useState<File | null>(null)
  const [selectedMany, setSelectedMany] = useState<File[]>([])
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
    onFileSelect?.(file)
  }

  const handleFiles = (files: File[]) => {
    for (const file of files) {
      const err = validate(file)
      if (err) {
        setError(`${file.name}: ${err}`)
        return
      }
    }
    setError(null)
    setSelectedMany(files)
    onFilesSelect?.(files)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (multiple) {
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) handleFiles(files)
    } else {
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    }
  }

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (multiple) {
      const files = Array.from(e.target.files ?? [])
      if (files.length > 0) handleFiles(files)
    } else {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      {label && <span className="text-sm font-medium text-graphite/70">{label}</span>}
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
          dragging ? 'border-signal bg-signal-50' : 'border-hairline hover:border-graphite/30'
        )}
      >
        <UploadCloud className="w-8 h-8 text-graphite/30" />
        {multiple ? (
          selectedMany.length > 0 ? (
            <div className="text-center">
              <p className="text-sm font-medium text-graphite/70">
                {selectedMany.length} file{selectedMany.length === 1 ? '' : 's'} selected
              </p>
              <p className="font-stamp text-xs text-graphite/50">
                {(selectedMany.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                total
              </p>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-sm text-graphite/60">
                Drag & drop or <span className="text-signal font-medium">browse</span>
              </p>
              <p className="text-xs text-graphite/40 mt-1">Max {maxSizeMb}MB per file</p>
            </div>
          )
        ) : selected ? (
          <div className="text-center">
            <p className="text-sm font-medium text-graphite/70">{selected.name}</p>
            <p className="font-stamp text-xs text-graphite/50">
              {(selected.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-graphite/60">
              Drag & drop or <span className="text-signal font-medium">browse</span>
            </p>
            <p className="text-xs text-graphite/40 mt-1">Max {maxSizeMb}MB</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={onInputChange}
          className="hidden"
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}
