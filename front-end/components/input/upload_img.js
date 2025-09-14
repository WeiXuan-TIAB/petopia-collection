'use client'

import React, { useRef } from 'react'
import '@/styles/globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'

export default function UploadImg({ onFileChange }) {
  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange?.(e.target.files[0])
    }
  }

  return (
    <div className="
      min-w-[280px] 
      max-w-[400px] 
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
      {/* 左側提示區（點這邊也可觸發上傳） */}
      <button
        type="button"
        onClick={handleClick}
        className="
          flex-1 
          min-w-0 
          h-full 
          flex 
          items-center 
          pl-5 
          pr-4 
          gap-3
          text-left
        "
      >
        <FontAwesomeIcon icon={faArrowUpFromBracket} className="w-4 h-4 text-icon-primary" />
        <span className="
          font-fake-pearl 
          font-normal 
          text-base 
          text-text-secondary 
          truncate
        ">
          請上傳圖片
        </span>
      </button>

      {/* 右側按鈕 */}
      <button
        type="button"
        onClick={handleClick}
        className="
          w-20 
          flex-shrink-0 
          h-full 
          rounded-r-full 
          bg-primary 
          text-text-light 
          font-fake-pearl 
          font-medium 
          text-base 
          whitespace-nowrap 
          hover:bg-orange-600
          transition
        "
      >
        上傳
      </button>

      {/* 真正的 input hidden */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}