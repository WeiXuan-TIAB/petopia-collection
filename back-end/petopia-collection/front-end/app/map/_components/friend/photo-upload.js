'use client'
import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import Image from 'next/image'

/**
 * PhotoUploadMulti
 * props:
 *  - onChange(files: File[]): 回傳目前選擇的新檔案陣列
 *  - defaultUrls?: string[]  : 已存在的圖片（例如資料庫），會先顯示
 *  - onRemoveExisting?: (url:string)=>void : 刪除既有圖片時回調
 *  - accept?: string         : 預設 'image/*'
 *  - maxCount?: number       : 最大可選張數（含 defaultUrls），預設 8
 */
export default function PhotoUploadMulti({
  onChange,
  defaultUrls = [],
  onRemoveExisting,
  accept = 'image/*',
  maxCount = 8,
  className = '',
}) {
  const inputId = useId()
  const inputRef = useRef(null)

  // 新選擇的檔案（含預覽 blobURL）
  const [files, setFiles] = useState/** @type {Array<{file: File, url: string, id: string}>} */([])

  // 既有的線上圖片（URL）
  const [existing, setExisting] = useState(defaultUrls)

  useEffect(() => setExisting(defaultUrls), [defaultUrls])

  // 清理 blobURL
  useEffect(() => {
    return () => files.forEach(f => URL.revokeObjectURL(f.url))
  }, [files])

  const totalCount = useMemo(() => existing.length + files.length, [existing, files])
  const remaining = maxCount - totalCount

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files || [])
    if (!selected.length) return

    // 不能超過 maxCount
    const allowed = selected.slice(0, Math.max(0, remaining))

    // 產生預覽物件
    const mapped = allowed.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(36).slice(2)}`,
    }))

    setFiles(prev => {
      const next = [...prev, ...mapped]
      onChange?.(next.map(x => x.file))
      return next
    })

    // 允許再次選同一檔（清掉 input 值）
    e.target.value = ''
  }

  const removeNew = (id) => {
    setFiles(prev => {
      const target = prev.find(x => x.id === id)
      if (target) URL.revokeObjectURL(target.url)
      const next = prev.filter(x => x.id !== id)
      onChange?.(next.map(x => x.file))
      return next
    })
  }

  const removeExisting = (url) => {
    setExisting(prev => prev.filter(u => u !== url))
    onRemoveExisting?.(url)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 隱藏 input */}
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        onChange={handleFileChange}
      />

      {/* 膠囊上傳觸發區（點它開檔案選擇） */}
      <label
        htmlFor={inputId}
        className={[
          'flex items-center w-full h-[64px] px-5 cursor-pointer',
          'rounded-[999px] border-2 border-[#3A2B2B] bg-white',
          'focus-within:ring-2 focus-within:ring-[#3A2B2B]/15',
          remaining <= 0 ? 'opacity-60 cursor-not-allowed' : '',
        ].join(' ')}
        aria-disabled={remaining <= 0}
      >
        <div className="w-10 h-10 rounded-md bg-[#C8B8AC] flex items-center justify-center">
          {/* 相片 icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3" y="3" width="18" height="18" rx="2" stroke="white" strokeWidth="2" />
            <circle cx="8.5" cy="8.5" r="1.5" fill="white" />
            <path d="M21 15l-5-5L5 21" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="ml-3 text-[#8B7355]">{remaining > 0 ? `可再選 ${remaining} 張` : '已達上限'}</span>
      </label>

      {/* 縮圖清單 */}
      {(existing.length > 0 || files.length > 0) && (
        <div className="flex flex-wrap gap-3">
          {/* 既有圖片（URL） */}
          {existing.map((url) => (
            <Thumb key={url} url={url} onRemove={() => removeExisting(url)} />
          ))}

          {/* 新增的檔案（blobURL） */}
          {files.map((item) => (
            <Thumb key={item.id} url={item.url} onRemove={() => removeNew(item.id)} />
          ))}
        </div>
      )}
    </div>
  )
}

/** 縮圖 + 刪除按鈕 */
function Thumb({ url, onRemove }) {
  return (
    <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-[#E6DDD5]">
      <Image src={url} alt="上傳圖片預覽" fill className="object-cover" unoptimized />
      <button
        type="button"
        onClick={onRemove}
        aria-label="刪除"
        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-black/60 text-white grid place-items-center hover:bg-black/70"
      >
        ×
      </button>
    </div>
  )
}
