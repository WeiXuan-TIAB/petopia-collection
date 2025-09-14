'use client'
import { Checkbox } from '@/app/_components/ui/checkbox'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

const PARAM_KEYS = {
  地區: 'city',
  類別: 'type',
}

// 中文 → 英文
const typeMap = {
  '貓貓友善': 'cat_friendly',
  '狗狗友善': 'dog_friendly',
  '貓狗友善': 'pet_friendly',
}

export default function RestaurantSidebar({ categoryInfos }) {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const getParamKey = (categoryName) => PARAM_KEYS[categoryName] ?? null

  const toggleValueInCsv = (csv, value) => {
    const arr = csv ? csv.split(',').filter(Boolean) : []
    const i = arr.indexOf(value)
    if (i >= 0) arr.splice(i, 1) // 取消
    else arr.push(value) // 新增
    return arr.join(',')
  }

  const handleToggle = (categoryName, subName) => {
    const key = getParamKey(categoryName)
    if (!key) return

    const next = new URLSearchParams(sp.toString())
    const currCsv = next.get(key) || ''

    // 如果是 "類別" 參數，要先把 subName 轉成英文代碼
    const valueForUrl = key === 'type' ? (typeMap[subName] || subName) : subName

    const nextCsv = toggleValueInCsv(currCsv, valueForUrl)

    if (nextCsv) next.set(key, nextCsv)
    else next.delete(key)

    // 換條件時重設頁數
    next.set('page', '1')
    router.push(`${pathname}?${next.toString()}`)
  }

  const isChecked = (categoryName, subName) => {
    const key = getParamKey(categoryName)
    if (!key) return false
    const csv = sp.get(key) || ''
    // 比對時要用 URL 的英文代碼
    const valueForUrl = key === 'type' ? (typeMap[subName] || subName) : subName
    return csv.split(',').includes(valueForUrl)
  }

  return (
    <div className="hidden md:flex flex-col flex-shrink-0 w-40 gap-6">
      <div className="flex flex-col gap-6">
        {categoryInfos.map((category, catIdx) => (
          <div key={catIdx}>
            <h5 className="text-lg text-primary font-semibold pb-2 border-b-2 border-brand-warm border-dotted">
              {category.name}
            </h5>
            <div className="flex flex-col pt-3 gap-2">
              {category.subCategories.map((sub, subIdx) => {
                const id = `${category.name}-${sub.name}`
                const checked = isChecked(category.name, sub.name)
                return (
                  <label
                    key={subIdx}
                    htmlFor={id}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={id}
                      checked={checked}
                      onCheckedChange={(val) =>
                        handleToggle(category.name, sub.name, Boolean(val))
                      }
                      className="text-white rounded-md shadow-none"
                    />
                    {sub.name}
                  </label>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
