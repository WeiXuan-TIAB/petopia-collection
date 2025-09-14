'use client'

import React from 'react'
import '@/styles/globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = "請輸入關鍵字"
}) {
  return (
    <div className="
      min-w-[280px] 
      max-w-[500px] 
      w-full
      sm:w-[350px] 
      md:w-[400px]
      h-10 
      rounded-full 
      border-2 border-primary
      bg-background-secondary
      overflow-hidden
      flex
    ">
      {/* 左側輸入區 */}
      <div className="flex-1 min-w-0 flex items-center pl-5 pr-4 gap-3">
        <FontAwesomeIcon icon={faSearch} className="w-4 h-4 text-text-secondary" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            flex-1 min-w-0 
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

      {/* 右側按鈕 */}
      <button
        onClick={onSearch}
        className="
          w-20 
          flex-shrink-0 
          h-full 
          rounded-r-full 
          bg-primary 
          flex items-center justify-center 
          hover:bg-orange-600 transition
        "
      >
        <span className="
          font-fake-pearl 
          font-medium 
          text-base 
          text-text-light 
          whitespace-nowrap
        ">
          搜尋
        </span>
      </button>
    </div>
  )
}