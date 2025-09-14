'use client'

import React from 'react'
import '@/styles/globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons'

export default function BtnSort() {
  return (
    <>
      {/* 最外層容器 - 設定響應式尺寸和整體樣式 */}
      <div
        className="
        min-w-[100px] 
        max-w-[160px] 
        w-full
        sm:w-[110px] 
        md:w-[123px]
        h-10 
        rounded-full 
        bg-background-secondary
        border-2 border-primary
      "
      >
        {/* 內容容器 - 價格文字和排序圖標的 Flex 佈局 */}
        <div
          className="
          w-full 
          h-full 
          flex
          items-center
          justify-center
          gap-2
          px-4
        "
        >
          {/* 價格文字容器 */}
          <div className="flex-shrink-0">
            <span
              className="
              font-fake-pearl 
              font-medium 
              text-base
              leading-relaxed 
              tracking-normal 
              text-text-bprimary
              whitespace-nowrap
            "
            >
              價格
            </span>
          </div>

          {/* 排序圖標容器 */}
          <div
            className="
            flex-shrink-0
            flex
            flex-col
            items-center
            justify-center
            gap-0.5
          "
          >
            {/* 向上箭頭 */}
            <FontAwesomeIcon
              icon={faCaretUp}
              className="w-3 h-3 text-text-bprimary -mb-1"
            />
            {/* 向下箭頭 */}
            <FontAwesomeIcon
              icon={faCaretDown}
              className="w-3 h-3 text-text-bprimary -mt-1"
            />
          </div>
        </div>
      </div>
    </>
  )
}
