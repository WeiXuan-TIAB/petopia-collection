'use client'

import React from 'react'
import '@/styles/globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default function SearchInputSeparate({
  value,
  onChange,
  onSearch,
  placeholder = '請輸入關鍵字',
}) {
  return (
    <div
      className="
      flex 
      items-center 
      gap-4
      w-full
      max-w-lg
    "
    >
      {/* 輸入框區域 */}
      <div
        className="
        min-w-[240px]
        max-w-[350px]
        flex-1
        sm:w-[297px]
        md:w-[297px]
        h-10
        rounded-full
        border-2 border-primary
        bg-background-secondary
        overflow-hidden
        flex
        items-center
        px-5
      "
      >
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full
            bg-transparent
            border-none
            outline-none
            font-fake-pearl 
            text-base
            text-text-secondary
            placeholder-text-secondary
          "
        />
      </div>

      {/* 搜尋按鈕 */}
      <button
        onClick={onSearch}
        className="
          min-w-[100px]
          sm:w-[120px]
          md:w-[120px]
          h-10
          rounded-full
          bg-primary
          flex-shrink-0
          flex 
          items-center 
          justify-center 
          gap-2
          px-4
          hover:bg-orange-600
          transition
        "
      >
        <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-icon-light" />
        <span
          className="
          font-fake-pearl 
          font-medium 
          text-base
          text-text-light
          whitespace-nowrap
        "
        >
          搜尋
        </span>
      </button>
    </div>
  )
}
