'use client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export function SortSelect() {
  const router = useRouter()
  const pathname = usePathname()
  const sp = useSearchParams()

  const sort = sp.get('sort') || '' // 預設空 → 後端會用預設排序

  const onChange = (v) => {
    const next = new URLSearchParams(sp.toString())
    if (v) next.set('sort', v)
    else next.delete('sort')
    next.set('page', '1') // 換排序時回到第 1 頁
    router.push(`${pathname}?${next.toString()}`)
  }

  return (
    <Select value={sort} onValueChange={onChange}>
      <SelectTrigger className="border-none bg-white rounded-full overflow-hidden px-4 py-2 outline-none text-sm text-gray-400 w-40">
        <SelectValue placeholder="排序方式" />
      </SelectTrigger>
      <SelectContent className="bg-white text-sm">
        <SelectItem value="ratingDesc" className="hover:bg-primary/10">
          評價由高至低
        </SelectItem>
        <SelectItem value="ratingAsc" className="hover:bg-primary/10">
          評價由低至高
        </SelectItem>
        <SelectItem value="newest" className="hover:bg-primary/10">
          最新上架
        </SelectItem>
        <SelectItem value="oldest" className="hover:bg-primary/10">
          最舊
        </SelectItem>
        <SelectItem value="nameAsc" className="hover:bg-primary/10">
          店名 A→Z
        </SelectItem>
        <SelectItem value="nameDesc" className="hover:bg-primary/10">
          店名 Z→A
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
