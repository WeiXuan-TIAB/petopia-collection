'use client'

import React from 'react'
import '@/styles/globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faChevronDown } from '@fortawesome/free-solid-svg-icons'

export default function EvaluateDisplay() {
  return (
    <>
      {/* 最外層容器 - 設定響應式尺寸和整體樣式 */}
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
      ">
        {/* 內容容器 - 評價區域和下拉箭頭的 Flex 佈局 */}
        <div className="
          w-full 
          h-full 
          flex
        ">
          
          {/* 評價顯示區域 */}
          <div className="
            flex-1 
            min-w-0
          ">
            {/* 評價內容容器 */}
            <div className="
              w-full 
              h-full 
              flex 
              items-center 
              pl-4 
              pr-3 
              gap-3
            ">
              {/* Sort Icon 容器 */}
              <div className="flex-shrink-0">
                <FontAwesomeIcon 
                  icon={faSort} 
                  className="w-4 h-4 text-text-bprimary" 
                />
              </div>
              
              {/* Evaluate Text 容器 */}
              <div className="flex-1">
                <span className="
                  font-fake-pearl 
                  font-normal 
                  text-base
                  leading-relaxed 
                  tracking-normal 
                  text-text-bprimary
                  block
                  truncate
                ">
                  評價由高至低
                </span>
              </div>
            </div>
          </div>

          {/* 下拉箭頭區域 */}
          <div className="
            w-12
            flex-shrink-0
          ">
            {/* 箭頭內容容器 */}
            <div className="
              w-full 
              h-full
              flex 
              items-center 
              justify-center
            ">
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className="w-4 h-4 text-text-bprimary" 
              />
            </div>
          </div>

        </div>
      </div>
    </>
  )
}