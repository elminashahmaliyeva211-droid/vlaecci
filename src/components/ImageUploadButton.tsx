'use client'

import { useRef, useState } from 'react'
import { Upload, Loader2 } from 'lucide-react'

export function ImageUploadButton({ onUploaded }: { onUploaded: (url: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Yalnız şəkil faylları (jpg, png, webp)')
      return
    }
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Xəta')
      onUploaded(data.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Yükləmə uğursuz')
    } finally {
      setLoading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className="p-3 rounded-lg border-2 border-dashed border-sand-300 hover:border-accent-rose/50 text-brown-100 hover:text-accent-rose transition-colors disabled:opacity-50"
        title="Şəkil yüklə"
      >
        {loading ? <Loader2 size={24} className="animate-spin" /> : <Upload size={24} />}
      </button>
      {error && <span className="text-xs text-red-500 text-center">{error}</span>}
    </div>
  )
}
