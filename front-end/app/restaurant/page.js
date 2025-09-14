'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation' // 👈 引入 useRouter
import Breadcrumb from '@/app/_components/breadcrumb'
import RestaurantGrid from '@/app/restaurant/_components/restaurant-grid'
import { RestaurantPagination } from '@/app/restaurant/_components/restaurant-pagination'
import RestaurantSidebar from '@/app/restaurant/_components/restaurant-sidebar'
import { SortSelect } from '@/app/restaurant/_components/sort-select'
import SelectedTags from '@/app/restaurant/_components/selected-tags'
import { useRestaurants } from '@/services/rest-client/use-restaurants'

import { FaUtensils } from 'react-icons/fa'

export default function RestaurantPage() {
  const router = useRouter()
  const sp = useSearchParams()

  const categories = [
    {
      name: '地區',
      subCategories: [
        { name: '台北市' },
        { name: '新北市' },
        { name: '台中市' },
        { name: '高雄市' },
      ],
    },
    {
      name: '類別',
      subCategories: [
        { name: '貓貓友善' },
        { name: '狗狗友善' },
        { name: '貓狗友善' },
      ],
    },
  ]

  const [selectedSubs, setSelectedSubs] = useState([])
  const handleToggleSub = (subName) => {
    setSelectedSubs((prev) =>
      prev.includes(subName)
        ? prev.filter((n) => n !== subName)
        : [...prev, subName]
    )
  }

  // 從 URL 讀取參數
  const page = Math.max(parseInt(sp.get('page') || '1', 10), 1)
  const pageSize = Math.max(parseInt(sp.get('pageSize') || '12', 10), 12)
  const city = sp.get('city') || ''
  const area = sp.get('area') || ''
  const type = sp.get('type') || ''
  const q = sp.get('q') || ''

  // 用 state 綁定搜尋框（預設填 URL 參數的 q）
  const [searchValue, setSearchValue] = useState(q)

  const { total } = useRestaurants({ page, pageSize, city, area, type, q })

  // 按搜尋鍵，更新 URL，觸發 useRestaurants 重新請求
  const handleSearch = () => {
    const params = new URLSearchParams(sp.toString())
    if (searchValue) {
      params.set('q', searchValue)
    } else {
      params.delete('q')
    }
    params.set('page', '1') // 搜尋重設到第一頁
    router.push(`/restaurant?${params.toString()}`)
  }

  return (
    <>
      <section className="w-full px-4 py-4 lg:py-8">
        <div className="container max-w-7xl mx-auto">
          <Breadcrumb />
          <div className="flex flex-col gap-6 bg-[url('/images/restaurant/bg.jpg')] bg-cover bg-center rounded-4xl p-6 md:p-12">
            <h3 className="text-xl xl:text-3xl text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.66)]">
              尋找最吸引您的寵物友善餐廳
            </h3>
            <div className="flex flex-col md:flex-row xl:items-stretch -space-x-px gap-6 md:gap-0">
              <div className="relative">
                <label
                  htmlFor="restaurantSearch"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none peer-valid:hidden peer-focus:hidden"
                >
                  <FaUtensils />
                </label>
                <input
                  id="restaurantSearch"
                  name="restaurantSearch"
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="請輸入餐廳名稱"
                  className="border border-primary bg-white rounded-full md:rounded-r-none overflow-hidden pl-12 pr-8 py-2 outline-none text-base text-start w-full md:w-72 h-11"
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />

                {/* 清除按鈕（只有有輸入值時才顯示） */}
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchValue('')
                      const params = new URLSearchParams(sp.toString())
                      params.delete('q')
                      params.set('page', '1')
                      router.push(`/restaurant?${params.toString()}`)
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="inline-block flex-shrink-0 bg-primary hover:bg-brand-warm transition-colors duration-300 text-white rounded-r-full rounded-l-full md:rounded-l-none px-8 py-2"
              >
                搜尋
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-4 lg:py-8 overflow-hidden">
        <div className="container max-w-7xl mx-auto">
          <div className="flex gap-6">
            <div className="hidden md:flex flex-col flex-shrink-0 w-40 gap-6">
              <RestaurantSidebar
                categoryInfos={categories}
                selectedSubs={selectedSubs}
                onToggleSub={handleToggleSub}
              />
            </div>

            <div className="flex flex-col gap-2 grow">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                <div className="text-lg">{total} 家寵物友善餐廳</div>
                <SortSelect />
              </div>

              <div className="flex items-center flex-wrap gap-2">
                <SelectedTags
                  selectedSubs={selectedSubs}
                  onRemoveTag={handleToggleSub}
                />
              </div>

              <RestaurantGrid />

              <RestaurantPagination
                className="mt-6"
                total={total}
                pageSize={pageSize}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
