'use client'

import React, { useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function SearchBox({
  value,
  onChange,
  onSearch,                       // ← 新增：按 icon 或 Enter 觸發
  placeholder = '請輸入關鍵字',
  className = '',
}) {
  // 送出事件（點 icon 或按 Enter）
  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault?.()
      onSearch?.(value ?? '')
    },
    [onSearch, value]
  )

  return (
    <form onSubmit={handleSubmit}>
      <div
        className={`flex items-center h-[32px] md:h-[36px] lg:h-[40px] xl:h-[44px] 
        rounded-full border border-[#EE5A36] px-3 md:px-4 bg-white ${className}`}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              handleSubmit(e)
            }
          }}
          autoComplete="off"
          className="flex-1 outline-none text-[12px] md:text-[14px] lg:text-[15px] xl:text-[16px] placeholder-[#C8B8AC] text-[#3E2E2E]"
          aria-label="搜尋地點"
        />

        {/* 放大鏡按鈕：點擊觸發 onSearch */}
        <button
          type="button"
          onClick={handleSubmit}
          aria-label="搜尋"
          className="flex items-center justify-center"
        >
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="w-[16px] h-[16px] text-[#C8B8AC]"
            aria-hidden="true"
          />
        </button>
      </div>
    </form>
  )
}