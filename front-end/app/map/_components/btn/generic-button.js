'use client'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function GenericButton({
  text,
  icon = null,
  className = '',
  onClick,          // 接收 onClick
  ...rest           // 其餘 props 也帶下去（例如 aria-*）
}) {
  return (
    <button
      type="button"
      onClick={onClick}   // 傳給原生 button
      className={`
        h-[45px] md:h-[72px]
        px-[34px] py-[18px]
        rounded-[40px]
        font-medium md:font-semibold
        text-sm md:text-2xl
        transition-all duration-200
        flex items-center justify-center gap-2
        bg-[#ee5a36] border-[3px] border-[#ee5a36] text-white
        hover:bg-transparent hover:text-[#ee5a36]
        ${className}
      `}
      {...rest}
    >
      {text}
      {icon && <FontAwesomeIcon icon={icon} className="text-sm md:text-base" />}
    </button>
  )
}
