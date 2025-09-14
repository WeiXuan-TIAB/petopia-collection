'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function IconButton({
  text = '',
  icon,
  pressed,                 // 受控模式（可選）
  defaultPressed = false,  // 非受控初始值（舊的 initialPressed）
  onToggle,
  onClick,
  className = '',
  disabled = false,
  size = 'md',             // 'sm' | 'md' | 'lg'
  activeBg = '#ee5a36',
  inactiveBg = '#f5ab54',
}) {
  const isControlled = pressed !== undefined
  const [internalPressed, setInternalPressed] = useState(defaultPressed)
  const isPressed = isControlled ? pressed : internalPressed

  // 外部 pressed 改變時，非受控不跟
  useEffect(() => {
    if (isControlled) return
    setInternalPressed(defaultPressed)
  }, [defaultPressed, isControlled])

  const sizes = useMemo(() => {
    if (size === 'sm') return { pad: 'p-2', icon: 'w-[16px] h-[16px]', text: 'text-[11px]' }
    if (size === 'lg') return { pad: 'p-4', icon: 'w-[20px] h-[20px]', text: 'text-sm' }
    return { pad: 'p-3', icon: 'w-[18px] h-[18px]', text: 'text-xs' }
  }, [size])

  const handleClick = (e) => {
    if (!isControlled) setInternalPressed(!isPressed)
    onToggle?.(!isPressed)
    onClick?.(e)
  }

  const label = text || (isPressed ? '切換關閉' : '切換開啟')

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={isPressed}
      aria-label={label}
      className={`
        flex flex-col items-center justify-center gap-1
        transition-all duration-200 hover:opacity-90
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {/* 圓角方形背景 */}
      <div
        className={`
          ${sizes.pad} rounded-[8px]
          flex items-center justify-center
          transition-all duration-200 shadow-sm
        `}
        style={{ backgroundColor: isPressed ? activeBg : inactiveBg }}
      >
        <FontAwesomeIcon icon={icon} className={`${sizes.icon} text-white`} />
      </div>
    </button>
  )
}