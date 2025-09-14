// components/common/place-features.js
'use client'

import React, { useMemo } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faUtensils, 
  faShoppingBag, 
  faTree, 
  faPaw, 
  faCar, 
  faWheelchair 
} from '@fortawesome/free-solid-svg-icons'

// 可重用的特徵定義（保持你的配色）
export const FEATURES_CATALOG = {
  indoor_dining:          { icon: faUtensils,        label: '內用',     color: 'text-blue-600' },
  takeout:                { icon: faShoppingBag,     label: '外帶',     color: 'text-green-600' },
  outdoor_seating:        { icon: faTree,            label: '戶外座位', color: 'text-emerald-600' },
  pet_menu:               { icon: faPaw,             label: '寵物餐點', color: 'text-orange-600' },
  parking:                { icon: faCar,             label: '停車場',   color: 'text-purple-600' },
  wheelchair_accessible:  { icon: faWheelchair,      label: '無障礙',   color: 'text-indigo-600' },
}

const FEATURE_KEYS = Object.keys(FEATURES_CATALOG)

// 讓 features 同時支援陣列或物件
function normalizeFeatureFlags(features) {
  if (!features) return {}
  if (Array.isArray(features)) {
    return Object.fromEntries(features.map(k => [k, true]))
  }
  return features
}

// 地點特色（完整/compact 兩種樣式）
export default function PlaceFeatures({ features, className = '', compact = false }) {
  const flags = useMemo(() => normalizeFeatureFlags(features), [features])

  const active = useMemo(
    () => FEATURE_KEYS
      .filter(key => Boolean(flags[key]))
      .map(key => ({ key, ...FEATURES_CATALOG[key] })),
    [flags]
  )

  if (active.length === 0) return null

  if (compact) {
    // 只有圖示的小版本
    return (
      <div className={`flex gap-1 ${className}`}>
        {active.map(({ key, icon, label, color }) => (
          <div
            key={key}
            className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full"
            title={label}
            aria-label={label}
          >
            <FontAwesomeIcon icon={icon} className={`w-3 h-3 ${color}`} />
            <span className="sr-only">{label}</span>
          </div>
        ))}
      </div>
    )
  }

  // 完整版本（標題 + 標籤）
  return (
    <div className={`space-y-2 ${className}`}>
      <h4 className="text-sm font-medium text-gray-700">設施特色</h4>
      <div className="flex flex-wrap gap-2">
        {active.map(({ key }) => (
          <FeatureTag key={key} featureKey={key} isActive />
        ))}
      </div>
    </div>
  )
}

// 單一特色標籤（可獨立使用）
export function FeatureTag({ featureKey, isActive = true, size = 'sm', className = '' }) {
  const feature = FEATURES_CATALOG[featureKey]
  if (!feature) return null

  const containerSize = {
    xs: 'px-1 py-0.5 text-[10px] rounded-full',
    sm: 'px-2 py-1 text-xs rounded-full',
    md: 'px-3 py-1 text-sm rounded-full',
    lg: 'px-4 py-2 text-base rounded-full',
  }[size] || 'px-2 py-1 text-xs rounded-full'

  const iconSize = {
    xs: 'w-3 h-3',
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }[size] || 'w-3 h-3'

  return (
    <div
      className={`
        inline-flex items-center gap-1
        ${containerSize}
        ${isActive ? `bg-gray-100 ${feature.color}` : 'bg-gray-50 text-gray-400'}
        ${className}
      `}
      aria-label={feature.label}
    >
      <FontAwesomeIcon icon={feature.icon} className={iconSize} />
      <span>{feature.label}</span>
    </div>
  )
}