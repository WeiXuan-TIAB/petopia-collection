'use client'
import React from 'react'

/**
 * NameTitleField
 * - nameValue / onNameChange：名字輸入框
 * - titleValue / onTitleChange：稱謂 select
 * - titles：稱謂選項（之後接 DB）
 * - placeholder：預設 "例如：毛毛"
 * - error / helperText：錯誤提示（可選）
 */
export default function NameTitleField({
  nameValue = '',
  onNameChange = () => {},
  titleValue = '',
  onTitleChange = () => {},
  titles = ['先生', '小姐', '老闆', '主人'],
  placeholder = '例如：毛毛',
  required = false,
  disabled = false,
  error = '',
  helperText = '',
  className = '',
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 名字輸入框 */}
      <div className="flex-1">
        <input
          type="text"
          value={nameValue}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={[
            'w-full h-12 px-5 rounded-full',
            'border',
            error ? 'border-red-400' : 'border-[#E6DDD5]',
            'bg-white text-[16px] text-[#2E2019] placeholder:text-[#C8B8AC]',
            'outline-none focus:ring-2 focus:ring-[#F5AB54]/40 focus:border-[#F5AB54]',
            'disabled:opacity-60 disabled:cursor-not-allowed',
          ].join(' ')}
        />
        {(error || helperText) && (
          <p
            className={`mt-1 text-xs ${
              error ? 'text-red-500' : 'text-[#8B7355]'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>

      {/* 稱謂選單 */}
      <div className="relative">
        <select
          value={titleValue}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={disabled}
          className={[
            'appearance-none',
            'h-12 min-w-[92px] pl-4 pr-9 rounded-full',
            'border border-[#E6DDD5] bg-white',
            'text-[16px] text-[#2E2019]',
            'outline-none focus:ring-2 focus:ring-[#F5AB54]/40 focus:border-[#F5AB54]',
            'disabled:opacity-60 disabled:cursor-not-allowed',
          ].join(' ')}
        >
          {/* 可選：加一個 placeholder 選項 */}
          {titleValue === '' && <option value="" disabled>請選擇</option>}
          {titles.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* 下拉箭頭 */}
        <svg
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M7 10l5 5 5-5" stroke="#2E2019" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  )
}