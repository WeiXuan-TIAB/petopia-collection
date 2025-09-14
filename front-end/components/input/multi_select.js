'use client'

import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faChevronDown, faLocationDot } from '@fortawesome/free-solid-svg-icons'

export default function MultiSelect({
  regionOptions = [
    { value: '', label: '用餐地點' },
    { value: 'taipei', label: '台北市' },
    { value: 'taichung', label: '台中市' },],
  dateOptions = [{ value: '', label: '用餐日' },],
  selectedRegion,
  selectedDate,
  onRegionChange,
  onDateChange,
  onSearch
}) {
  return (
    <div className="
      min-w-[320px] 
      max-w-[600px] 
      w-full
      sm:w-[400px] 
      md:w-[496px]
      h-10 
      rounded-full 
      border-2 border-primary
      bg-background-secondary
      overflow-hidden
      flex
    ">
      {/* 用餐地區 */}
      <div className="flex-1 min-w-0 border-r border-primary relative flex items-center px-4 gap-2">
        <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 text-text-secondary" />
        <select
          value={selectedRegion}
          onChange={(e) => onRegionChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent border-none outline-none appearance-none
                     font-fake-pearl text-sm text-text-primary cursor-pointer"
        >
          <option value="" disabled hidden>請選擇地區</option>
          {regionOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 text-text-primary pointer-events-none" />
      </div>

      {/* 用餐日期 */}
      <div className="flex-1 min-w-0 relative flex items-center px-4 gap-2">
        <FontAwesomeIcon icon={faCalendarDays} className="w-4 h-4 text-text-secondary" />
        <select
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
          className="flex-1 min-w-0 bg-transparent border-none outline-none appearance-none
                     font-fake-pearl text-sm text-text-primary cursor-pointer"
        >
          <option value="" disabled hidden>請選擇日期</option>
          {dateOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        <FontAwesomeIcon icon={faChevronDown} className="w-3 h-3 text-text-primary pointer-events-none" />
      </div>

      {/* 搜尋按鈕 */}
      <button
        onClick={onSearch}
        className="w-20 flex-shrink-0 h-9 my-auto rounded-r-full bg-primary
                   hover:bg-orange-600 transition flex items-center justify-center"
      >
        <span className="font-fake-pearl font-medium text-sm text-text-light whitespace-nowrap">
          搜尋
        </span>
      </button>
    </div>
  )
}