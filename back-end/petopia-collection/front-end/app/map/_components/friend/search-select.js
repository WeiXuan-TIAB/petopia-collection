'use client'
import React, { useEffect, useMemo, useRef, useState } from 'react'

/**
 * SearchSelect
 * props
 * - value: { id:any, label:string } | null             // 目前選中的項目
 * - onSelect: (item) => void                           // 使用者選擇時
 * - query: string                                      // 搜尋字（可選，受控）
 * - onQueryChange: (q) => void
 * - options: Array<{id:any, label:string}>             // 清單（可直接餵 DB 結果）
 * - fetchOnOpen?: () => Promise<void>                  // 打開下拉時去抓資料（可綁 API）
 * - placeholder?: string
 * - loading?: boolean
 */
export default function SearchSelect({
  value = null,
  onSelect = () => {},
  query: outerQuery,
  onQueryChange,
  options = [],
  fetchOnOpen,
  placeholder = '搜尋種類',
  loading = false,
  className = '',
}) {
  const [open, setOpen] = useState(false)
  const [innerQuery, setInnerQuery] = useState('')
  const [activeIdx, setActiveIdx] = useState(-1)
  const rootRef = useRef(null)

  const query = outerQuery !== undefined ? outerQuery : innerQuery
  const setQuery = onQueryChange || setInnerQuery

  // 開關下拉
  const toggleOpen = async () => {
    const next = !open
    setOpen(next)
    if (next && fetchOnOpen) await fetchOnOpen()
  }

  // 依搜尋字過濾（前端簡單包含；接後端就把 options 換成 API 回傳）
  const filtered = useMemo(() => {
    const q = (query || '').trim().toLowerCase()
    if (!q) return options
    return options.filter(o => o.label.toLowerCase().includes(q))
  }, [query, options])

  // 點外面關閉
  useEffect(() => {
    const onDoc = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  // 鍵盤操作
  const onKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      e.preventDefault()
      toggleOpen()
      return
    }
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(filtered.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filtered[activeIdx]) {
        onSelect(filtered[activeIdx])
        setOpen(false)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      {/* 膠囊輸入區 */}
      <div
        className={[
          'flex items-center gap-3 w-full h-[64px] px-5',
          'rounded-[999px] border-2 border-[#3A2B2B] bg-white',
          'focus-within:ring-2 focus-within:ring-[#3A2B2B]/15',
        ].join(' ')}
      >
        {/* 放大鏡 */}
        <svg
          aria-hidden
          className="w-8 h-8 flex-shrink-0 text-[#C8B8AC]"
          viewBox="0 0 24 24" fill="none"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>

        {/* 搜尋輸入 */}
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 text-[24px] placeholder:text-[#C8B8AC] text-[#2E2019] outline-none bg-transparent"
        />

        {/* 右側展開箭頭 */}
        <button
          type="button"
          onClick={toggleOpen}
          aria-label="切換下拉選單"
          className="p-2 rounded-md hover:bg-black/5"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 10l5 5 5-5"
              stroke="#2E2019"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* 下拉面板 */}
      {open && (
        <div
          role="listbox"
          className="absolute left-0 right-0 mt-2 max-h-72 overflow-auto rounded-2xl border border-[#E6DDD5] bg-white shadow-lg"
        >
          {loading && (
            <div className="px-4 py-3 text-[#8B7355]">載入中…</div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="px-4 py-3 text-[#8B7355]">找不到結果</div>
          )}

          {!loading &&
            filtered.map((opt, i) => {
              const active = i === activeIdx || (value && value.id === opt.id)
              return (
                <button
                  key={opt.id}
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIdx(i)}
                  onClick={() => {
                    onSelect(opt)
                    setOpen(false)
                  }}
                  className={[
                    'w-full text-left px-4 py-3 text-[18px]',
                    active ? 'bg-[#F8EEE7]' : 'hover:bg-[#FAF4EF]',
                    'text-[#2E2019]',
                  ].join(' ')}
                >
                  {opt.label}
                </button>
              )
            })}
        </div>
      )}
    </div>
  )
}
