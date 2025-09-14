'use client'

import React from 'react'
import '@/styles/globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCalendarDays,
  faChevronDown,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons'

export default function MultiSelectVertical({
  regionOptions = [
    { value: '', label: '用餐地點' },
    { value: 'taipei', label: '台北市' },
    { value: 'taichung', label: '台中市' },
  ],
  dateOptions = [
    { value: '', label: '用餐日' },
  ],
  selectedRegion,
  selectedDate,
  onRegionChange,
  onDateChange,
  onSearch,
}) {
  return (
    <div
      className="
      min-w-[240px] 
      max-w-[350px] 
      w-full
      sm:w-[260px] 
      md:w-[267px]
      flex
      flex-col
      gap-4
    "
    >
      {/* 地區選單 */}
      <div
        className="
        w-full
        h-10 
        rounded-full 
        bg-background-secondary
        border border-border-light
        relative
        flex items-center px-4 gap-3
      "
      >
        <FontAwesomeIcon
          icon={faLocationDot}
          className="w-4 h-4 text-text-secondary"
        />
        <select
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          className="
            flex-1 min-w-0 bg-transparent border-none outline-none appearance-none
            font-fake-pearl text-base text-text-primary cursor-pointer
          "
        >
          {regionOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="w-4 h-4 text-text-primary pointer-events-none"
        />
      </div>

      {/* 日期選單 */}
      <div
        className="
        w-full
        h-10 
        rounded-full 
        bg-background-secondary
        border border-border-light
        relative
        flex items-center px-4 gap-3
      "
      >
        <FontAwesomeIcon
          icon={faCalendarDays}
          className="w-4 h-4 text-text-secondary"
        />
        <select
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="
            flex-1 min-w-0 bg-transparent border-none outline-none appearance-none
            font-fake-pearl text-base text-text-primary cursor-pointer
          "
        >
          {dateOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <FontAwesomeIcon
          icon={faChevronDown}
          className="w-4 h-4 text-text-primary pointer-events-none"
        />
      </div>

      {/* 搜尋按鈕 */}
      <button
        onClick={onSearch}
        className="
          w-full
          h-10 
          rounded-full 
          bg-primary
          hover:bg-orange-600
          transition
          flex items-center justify-center
        "
      >
        <span
          className="
          font-fake-pearl 
          font-medium 
          text-base 
          text-text-light
        "
        >
          搜尋
        </span>
      </button>
    </div>
  )
}
