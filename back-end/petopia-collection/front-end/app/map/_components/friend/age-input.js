//map/_component/friend/age-input.js

'use client'
import React, { useId } from 'react'

/**
 * AgeInput
 * props:
 *  - value: number | ''               // 年齡值（整數）
 *  - unit: '歲' | '月'                 // 單位
 *  - onValueChange: (n | '') => void
 *  - onUnitChange: (u) => void
 *  - min?: number (default 0)
 *  - max?: number
 *  - autoConvert?: boolean (default false) // 切換單位時是否自動換算
 */
export default function AgeInput({
  value = '',
  unit = '歲',
  onValueChange = () => {},
  onUnitChange = () => {},
  min = 0,
  max,
  autoConvert = false,
  className = '',
}) {
  const inputId = useId()

  const clampInt = (v) => {
    if (v === '' || v === null || Number.isNaN(Number(v))) return ''
    let n = Math.trunc(Number(v))
    if (Number.isFinite(min)) n = Math.max(min, n)
    if (Number.isFinite(max)) n = Math.min(max, n)
    return n
  }

  const handleWheel = (e) => {
    // 避免滾輪不小心改數值
    e.currentTarget.blur()
  }

  const handleUnitChange = (newUnit) => {
    if (!autoConvert) return onUnitChange(newUnit)
    // 可選：自動換算
    if (value === '' || Number.isNaN(Number(value))) return onUnitChange(newUnit)
    const n = Math.trunc(Number(value))
    if (unit === '歲' && newUnit === '月') onValueChange(n * 12)
    if (unit === '月' && newUnit === '歲') onValueChange(Math.floor(n / 12))
    onUnitChange(newUnit)
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 數字輸入 */}
      <div className="relative">
        <label htmlFor={inputId} className="sr-only">年齡</label>
        <input
          id={inputId}
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="請輸入整數"
          value={value}
          min={min}
          max={max}
          onChange={(e) => onValueChange(clampInt(e.target.value))}
          onWheel={handleWheel}
          className={[
            'h-12 w-[160px] px-5',
            'rounded-[999px] border-2',
            'border-[#3A2B2B] bg-white/90',
            'text-[16px] text-[#2E2019] placeholder:text-[#C8B8AC]',
            'outline-none focus:ring-2 focus:ring-[#3A2B2B]/20',
          ].join(' ')}
        />
      </div>

      {/* 單位下拉：歲／月 */}
      <div className="relative">
        <select
          value={unit}
          onChange={(e) => handleUnitChange(e.target.value)}
          className={[
            'h-12 min-w-[92px] pl-5 pr-9',
            'rounded-[999px] border-2',
            'border-[#3A2B2B] bg-white',
            'text-[18px] font-medium text-[#2E2019]',
            'appearance-none outline-none focus:ring-2 focus:ring-[#3A2B2B]/20',
          ].join(' ')}
        >
          <option value="歲">歲</option>
          <option value="月">月</option>
        </select>
        {/* 下拉箭頭 */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          width="18" height="18" viewBox="0 0 24 24" fill="none"
        >
          <path d="M7 9l5 5 5-5" stroke="#2E2019" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}
