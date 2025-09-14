'use client'

import React from 'react'

// 響應式標籤組件 - 手機版 60x20px，桌面版 120x40px
export default function PetPersonalityTag({ 
  text, 
  isSelected = false, 
  onClick, 
  className = '' 
}) {
  return (
    <button
      className={`
        w-[60px] h-[20px]           // 手機版尺寸（縮小）
        md:w-[120px] md:h-[40px]    // 桌面版尺寸（縮小）
        font-fake-pearl 
        font-normal 
        text-[10px] md:text-base    // 手機版極小字體，桌面版標準字體
        rounded-full 
        whitespace-nowrap
        transition-all
        duration-200
        hover:opacity-90
        flex
        items-center
        justify-center
        mx-1 my-1                   // 減少外邊距
        ${isSelected 
          ? 'bg-[#ee5a36] text-white'        // #ee5a36 已選中
          : 'bg-[#f5ab54] text-white'        // #f5ab54 未選中
        }
        ${className}
      `}
      onClick={onClick}
    >
      {text}
    </button>
  )
}