// app/restaurant/_components/restaurant-grid.jsx
'use client'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { useRestaurants } from '@/services/rest-client/use-restaurants'
import RestaurantCard from './restaurant-card'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.2 } },
}
const cardVariants = {
  hidden: { opacity: 0, x: 50 },
  show: { opacity: 1, x: 0, transition: { duration: 1, ease: 'easeOut' } },
}

export default function RestaurantGrid() {
  const sp = useSearchParams()
  const page = Math.max(parseInt(sp.get('page') || '1', 10), 1)
  const pageSize = Math.max(parseInt(sp.get('pageSize') || '12', 10), 12)
  const city = sp.get('city') || ''
  const area = sp.get('area') || ''
  const type = sp.get('type') || '' // 可中文或 enum，後端已支援
  const q = sp.get('q') || ''

  const sort = sp.get('sort') || ''
  const { restaurants, isLoading, isError } = useRestaurants({
    page,
    pageSize,
    city,
    area,
    type,
    q,
    sort,
  })

  console.log('restaurants', restaurants)

  const ready = !isLoading && !isError

  return (
    <motion.div
      className="flex flex-col gap-6"
      variants={containerVariants}
      initial="hidden"
      animate={ready ? 'show' : 'hidden'}
    >
      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-40 rounded-2xl animate-pulse bg-gray-100"
            />
          ))}
        </div>
      )}
      {isError && <div className="text-red-500">載入失敗</div>}
      {ready && restaurants.length === 0 && (
        <div className="text-gray-500">沒有符合條件的餐廳</div>
      )}
      {ready && restaurants.length > 0 && (
        <div className="grid grid-cols-1 gap-6">
          {restaurants.map((item) => (
            <motion.div key={item.id ?? item.href} variants={cardVariants}>
              <RestaurantCard {...item} />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
