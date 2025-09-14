// app/restaurant/[id]/page.jsx
import RestaurantPageClient from './restaurant-page-client'
import { apiURL } from '@/config'

// 直接打你 Next 的 /api（由 rewrites 代理到 3005）
async function getRestaurant(id) {
  try {
    const res = await fetch(`${apiURL}/restaurants/${id}`, {
      cache: 'no-store', // 避免舊資料
    })
    const json = await res.json()
    return json?.data ?? null
  } catch {
    return null
  }
}

export async function generateMetadata({ params }) {
  const r = await getRestaurant(params.id)
  const title = r?.name ? `${r.name} | Petopia` : '吃吃 | Petopia'
  const desc = r?.description ?? '餐廳介紹'
  const img = r?.bannerSrc || r?.thumbnailSrc || undefined
  

  return {
    title,
    description: desc,
    openGraph: {
      title,
      description: desc,
      url: `/restaurant/${params.id}`,
      images: img ? [img] : undefined,
    },
    alternates: { canonical: `/restaurant/${params.id}` },
  }
}

export default async function Page({ params }) {
  const restaurant = await getRestaurant(params.id) // 可當作初始資料傳給 Client，避免二次請求
  return <RestaurantPageClient id={params.id} initialRestaurant={restaurant} />
}
