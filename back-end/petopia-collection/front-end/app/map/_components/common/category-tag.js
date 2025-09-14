// app/map/_components/card/CategoryTag.js
'use client'

import React from 'react'

// 分類顏色與英文 key 對照表
const CATEGORY_MAP = {
  寵物友善餐廳: { color: '#F5AB54', englishKey: 'Restaurant' },
  寵物公園: { color: '#1A9562', englishKey: 'Park' },
  寵物美容: { color: '#CF9DCA', englishKey: 'Grooming' },
  寵物旅館: { color: '#ED8066', englishKey: 'Hotel' },
  毛孩店長: { color: '#FCD34D', englishKey: 'PetOwner' },
  寵物用品: { color: '#84CC16', englishKey: 'PetSupplies' },
  特寵友善: { color: '#9FC4E8', englishKey: 'ExoticPets' },
  公用設施: { color: '#7F1D1D', englishKey: 'PublicFacility' },
  寵物醫院: { color: '#075985', englishKey: 'Veterinary' },
}

export default function CategoryTag({ category }) {
  const info = CATEGORY_MAP[category]

  if (!info) return null

  return (
    <span
      className="inline-block text-s font-medium text-white rounded-full px-3 py-1"
      style={{ backgroundColor: info.color }}
    >
      {category}
    </span>
  )
}