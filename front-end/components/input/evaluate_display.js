'use client'

import React from 'react'
import '@/styles/globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function EvaluateDisplay() {
  return (
    <div className="
      min-w-[200px]
      max-w-[280px] 
      w-full
      sm:w-[200px] 
      md:w-[213px]
      h-10 
      rounded-full 
      bg-background-secondary
      border-2 border-primary
      relative
    ">
      {/* 排序區塊 */}
      <div className="w-full h-full flex items-center pl-4 pr-10 gap-3">
        <FontAwesomeIcon 
          icon={faSort} 
          className="w-4 h-4 text-text-bprimary flex-shrink-0" 
        />

        {/* 下拉選單 */}
        <select
          className="
            flex-1 
            min-w-0 
            bg-transparent 
            border-none 
            outline-none 
            appearance-none 
            font-fake-pearl 
            text-base 
            text-text-bprimary 
            truncate
            cursor-pointer
          "
          defaultValue="high-to-low"
        >
          <option value="high-to-low">評價由高至低</option>
          <option value="low-to-high">評價由低至高</option>
          <option value="latest">最新評價</option>
        </select>
      </div>

      {/* 客製箭頭（用絕對定位壓在右側） */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <FontAwesomeIcon 
          icon={faChevronDown} 
          className="w-4 h-4 text-text-bprimary" 
        />
      </div>
    </div>
  )
}