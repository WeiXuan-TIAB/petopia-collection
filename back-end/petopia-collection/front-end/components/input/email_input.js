'use client'

import React from 'react'
import '@/styles/globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons' 

export default function EmailInput() {
  return (
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
      overflow-hidden
      flex 
      items-center 
      px-4 
      gap-2
    ">
      {/* Icon */}
      <div className="flex-shrink-0">
        <FontAwesomeIcon 
          icon={faEnvelope} 
          className="w-4 h-4 text-icon-primary" 
        />
      </div>

      {/* 可輸入 input 欄位 */}
      <input
        type="email"
        placeholder="請輸入Email"
        className="
          flex-1 
          min-w-0 
          bg-transparent 
          border-none 
          outline-none 
          font-fake-pearl 
          text-base 
          leading-relaxed 
          tracking-normal 
          text-icon-primary
          placeholder-icon-primary
        "
      />
    </div>
  )
}