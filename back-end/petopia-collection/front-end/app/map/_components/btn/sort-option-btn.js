'use client'

import { useEffect, useMemo, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import sortConfigData, { getDefaultSort } from '../common/sort-config'

/**
 * props:
 * - context: 'places' | 'reviews' | 'photos'
 * - value?: string                 // 受控用；若不傳則走非受控+自動預設
 * - onChange: (v: string) => void
 * - autoSelectDefault?: boolean    // 預設 true：自動選預設並觸發 onChange
 * - className?: string
 */
export default function SortDropdownBtn({
  context,
  value,
  onChange,
  autoSelectDefault = true,
  className = '',
}) {
  // 🔧 修正：使用 sortConfigData 而不是 sortOptions
  const options = useMemo(() => sortConfigData[context] || [], [context])
  const isControlled = value != null

  const [innerValue, setInnerValue] = useState(() =>
    isControlled ? value : getDefaultSort(context)
  )

  // 受控：外部 value 變更時同步
  useEffect(() => {
    if (isControlled) setInnerValue(value)
  }, [isControlled, value])

  // 非受控：context 變更時重設為該 context 的預設，並可自動觸發 onChange
  useEffect(() => {
    if (!isControlled) {
      const def = getDefaultSort(context)
      setInnerValue(def)
      if (autoSelectDefault && def) onChange?.(def)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context]) // 刻意不依賴 onChange/autoSelectDefault 以避免多次觸發

  const handleChange = (next) => {
    setInnerValue(next)
    onChange?.(next)
  }

  return (
    <div className={`relative inline-block text-left ${className}`}>
      <select
        value={innerValue}
        onChange={(e) => handleChange(e.target.value)}
        className="appearance-none border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        aria-label="排序"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <FontAwesomeIcon
        icon={faChevronDown}
        className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 w-4 h-4"
      />
    </div>
  )
}