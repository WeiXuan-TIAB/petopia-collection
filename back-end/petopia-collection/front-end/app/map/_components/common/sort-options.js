// app/map/_components/common/SortOptions.js
'use client'
import React from 'react'

export default function SortOptions({ options=[], value, onChange, className='' }) {
  return (
    <select
      className={`w-full border rounded-md px-2 py-1 text-sm ${className}`}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}