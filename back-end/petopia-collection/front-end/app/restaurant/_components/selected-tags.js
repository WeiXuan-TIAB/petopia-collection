'use client'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

export default function SelectedTags({ selectedSubs = [], onRemoveTag }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  // 中文 ↔ 英文對照
  const typeMap = {
    'cat_friendly': '貓貓友善',
    'dog_friendly': '狗狗友善',
    'pet_friendly': '貓狗友善',
  }
  const reverseTypeMap = Object.fromEntries(
    Object.entries(typeMap).map(([en, zh]) => [zh, en])
  )

  // 解析 CSV → 陣列
  const parseCsv = (v) =>
    typeof v === 'string' && v.trim() ? v.split(',') : []

  // URL 參數（已經是英文代碼）
  const cities = parseCsv(sp.get('city')) // 例: ['台北市']
  const types = parseCsv(sp.get('type'))  // 例: ['cat_friendly']

  // 本地標籤 → 英文
  const selectedSubsEN = selectedSubs.map((t) => reverseTypeMap[t] || t)

  // 顯示時：城市直接顯示中文，類型用 typeMap 轉成中文
  const toDisplay = (tag) => typeMap[tag] || tag

  // 所有要顯示的標籤（去重）
  const allTags = Array.from(
    new Set([...cities, ...types, ...selectedSubsEN])
  )

  if (allTags.length === 0) return null

  const removeFromCsv = (csvArr, value) => csvArr.filter((x) => x !== value)

  const handleRemove = (tag) => {
    const next = new URLSearchParams(sp.toString())
    let changed = false

    // 如果是城市（中文）
    if (cities.includes(tag)) {
      const arr = removeFromCsv(cities, tag)
      arr.length ? next.set('city', arr.join(',')) : next.delete('city')
      changed = true
    }

    // 如果是類型（英文代碼）
    if (types.includes(tag)) {
      const arr = removeFromCsv(types, tag)
      arr.length ? next.set('type', arr.join(',')) : next.delete('type')
      changed = true
    }

    if (changed) {
      next.set('page', '1')
      router.push(`${pathname}?${next.toString()}`)
      return
    }

    // 不是 URL 的，就交給本地 state
    onRemoveTag?.(tag)
  }

  return (
    <div className="flex flex-wrap gap-2 my-3">
      {allTags.map((tag) => (
        <div
          key={tag}
          className="flex items-center gap-3 border-[1px] border-primary text-primary px-4 py-1 rounded-full"
        >
          <span>{toDisplay(tag)}</span>
          <button
            type="button"
            onClick={() => handleRemove(tag)}
            className="text-primary hover:text-black"
            aria-label={`移除 ${toDisplay(tag)}`}
            title="移除"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
