'use client'

import React from 'react'
import '@/styles/globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons' 

export default function EmailInput() {
  return (
    <>
      {/* 最外層容器 - 設定響應式尺寸和樣式 */}
      <div className="
        min-w-[200px] 
        max-w-[400px] 
        w-full
        sm:w-80 
        md:w-[311px]
        h-10 
        rounded-full 
        border-2 border-primary 
        bg-background-secondary
        p-0
        overflow-hidden
      ">
        {/* 內容容器 - 包含 icon 和 placeholder */}
        <div className="
          w-full 
          h-full 
          flex 
          items-center 
          px-4 
          gap-2
        ">
          {/* Icon 容器 - 固定尺寸，不縮放 */}
          <div className="flex-shrink-0">
            <FontAwesomeIcon 
              icon={faEnvelope} 
              className="w-4 h-4 text-icon-primary" 
            />
          </div>

          {/* Text 容器 - 自動伸縮 */}
          <div className="flex-1 min-w-0">
            <span className="
              font-fake-pearl 
              text-base
              leading-relaxed 
              tracking-normal 
              text-icon-primary
              block
              truncate
            ">
              請輸入Email
            </span>
          </div>
        </div>
      </div>
    </>
  )
}