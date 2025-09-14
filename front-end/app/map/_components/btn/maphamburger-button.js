'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

// 互動地圖漢堡按鈕
export default function MapHamburgerButton({ onClick, isOpen = false, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex
        items-center
        justify-center
        z-[10000]
        transition-all
        duration-200
        hover:opacity-90
        ${className}
      `}
    >
      {/* 圓角方形背景 */}
      <div
        className={` 
          p-3
          rounded-[8px]
          flex
          items-center
          justify-center
          transition-all
          duration-200
          ${
            isOpen
              ? 'bg-[#C8B8AC]' // 開啟：背景灰
              : 'bg-[#ffffff]' // 關閉：背景白
          }
        `}
      >
        {/* icon：開啟變 X，關閉是漢堡 */}
        <FontAwesomeIcon 
          icon={isOpen ? faTimes : faBars} 
          className={`w-[18px] h-[18px] ${
            isOpen
              ? 'text-[#ffffff]' // 開啟：icon 白
              : 'text-[#C8B8AC]' // 關閉：icon 灰
          }`}
        />
      </div>
    </button>
  )
}
