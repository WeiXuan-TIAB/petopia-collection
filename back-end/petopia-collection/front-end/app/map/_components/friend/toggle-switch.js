//map/_component/friend/toggle-switch.js

'use client'
import React from 'react'

/**
 * ToggleSwitch
 * - options: ['男孩', '女孩'] / ['已絕育', '未絕育']
 * - selected: 當前選中的值
 * - onChange: 切換時回傳選中的值
 */
export default function ToggleSwitch({
  options = [],
  selected,
  onChange = () => {},
  className = '',
}) {
  if (options.length !== 2) {
    console.error('ToggleSwitch 需要正好兩個選項')
    return null
  }

  return (
    <div
      className={`flex border border-[#C8B8AC] rounded-full overflow-hidden ${className}`}
    >
      {options.map((option, idx) => {
        const isActive = selected === option
        return (
          <button
            key={option}
            onClick={() => onChange(option)}
            className={[
              'flex-1 py-2 text-center text-[16px]',
              isActive
                ? 'bg-[#C8B8AC] text-white font-medium'
                : 'bg-white text-[#2E2019]',
              idx === 0 ? 'rounded-l-full' : 'rounded-r-full',
              'transition-colors duration-200',
            ].join(' ')}
          >
            {option}
          </button>
        )
      })}
    </div>
  )
}