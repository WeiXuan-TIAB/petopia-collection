// app/forum/page.js
'use client'
import { useRouter } from 'next/navigation'
import '@/styles/globals.css'
import ForumHeader from '@/app/_components/forum/forum-header'
import HeroSection from '@/app/_components/forum/hero-section'
import ForumTabs from '@/app/_components/forum/forum-tabs'
import PopularSection from '@/app/_components/forum/popular-section'
import DiscussionSidebar from '@/app/_components/forum/disscussion-sidebar'
import Breadcrumb from '../_components/breadcrumb'

export default function ForumPage() {
  const router = useRouter()
  //popular-section:hover

  // 首頁熱門項目資料
  const homePopularItems = [
    {
      id: 1,
      image:
        'images/forum/popCat.JPG',
      alt: 'Maine',
      description: '巨貓當道:溫柔巨人，緬因貓魅力無法擋',
    },
    {
      id: 2,
      image:
        'images/forum/popDog.JPG',
      alt: 'Myopia',
      description: '狗狗也會近視嗎？毛孩視力健康冷知識分享',
    },
    {
      id: 3,
      image:
        'images/forum/popGecko.JPG',
      alt: 'leopard-gecko',
      description: '從零開始：模擬豹紋守宮原生棲地飼養秘訣',
    },
  ]

  // 首頁 ForumTabs 內容資料
  const homeContentData = {
    cats: {
      image: 'images/forum/IMG_5133.JPG',
      alt: '貓咪',
      articles: [
        '貓咪用頭蹭你是在標記氣味，代表他認定你是家人',
        '貓喝牛奶容易拉肚子，建議提供專用的寵物牛奶',
        '貓咪的鬍鬚可以感知空間大小，不要隨意修剪',
        '貓咪瞳色能看出性格？不同眼睛顏色的小祕密',
        '貓咪一天睡12-16小時是正常的，不用擔心',
      ],
      articleImages: [
        'images/forum/cat001.JPG',
        'images/forum/cat002.JPG',
        'images/forum/cat003.JPG',
        'images/forum/cat004.JPG',
        'images/forum/cat005.JPG',
      ],
    },
    dogs: {
      image: 'images/forum/IMG_5468.JPG',
      alt: '狗狗',
      articles: [
        '帶狗狗戶外探險必知安全守則活動小技巧',
        '草地上的慵懶午後，狗狗最懂的悠閒時光',
        '獨角獸裝扮亮相，狗狗cosplay超可愛',
        '狗狗憂鬱行為解析：毛孩心情低落的常見原因',
        '狗狗繁殖冷知識：生理週期與行為你了解嗎？',
      ],
      articleImages: [
        'images/forum/dog001.JPG',
        'images/forum/dog002.JPG',
        'images/forum/dog003.JPG',
        'images/forum/dog004.JPG',
        'images/forum/dog005.JPG',
      ],
    },
    special: {
      image: 'images/forum/gecko00.JPG',
      alt: '特寵',
      articles: [
        '兔子需要大量纖維，乾草是主要食物來源',
        '鳥類需要定期修剪指甲和翅膀以確保安全',
        '刺蝟為什麼會蜷成一球？保護機制護大解密',
        '爬蟲類需要適當的溫度和濕度環境',
        '狐獴家庭制度超嚴格，群體生活必知趣聞',
      ],
      articleImages: [
        'images/forum/rabbit.JPG',
        'images/forum/parrot.JPG',
        'images/forum/hedgehog.JPG',
        'images/forum/python.JPG',
        'images/forum/meerkat.JPG',
      ],
    },
  }

  // 處理熱門項目點擊
  const handlePopularItemClick = (item) => {
    // 根據 ID 決定跳轉位置
  const linkMap = {
    1: '/forum/article/17',  // 貓咪文章
    2: '/forum/article/19',  // 狗狗文章  
    3: '/forum/article/20',  // 守宮文章
  }
  
  if (linkMap[item.id]) {
    router.push(linkMap[item.id])
  } else {
    router.push(`/articles/${item.id}`)  // 原本的邏輯
  }
  }

  // 處理看更多點擊
  const handleShowMore = () => {
    router.push('/forum/list')
  }

  // //popular-section:hover
  // const handlePopularMouseEnter = () => {
  //   setIsPopularHovered(true)
  // }

  // const handlePopularMouseLeave = () => {
  //   setIsPopularHovered(false)
  // }

  return (
    <>
      {/* 主要容器 - 為 navbar 和 rightbar 留出空間 */}
      <div className="container pt-8 pr-4 bg-[#FEF1EA]">
        <Breadcrumb />
        <div className="min-h-screen">
          {/* 頂部搜尋區 */}
          <ForumHeader />

          {/* Main Layout - 左右分欄 */}
          <div className="container flex">
            {/* Left Content - 主內容區 */}
            <main className="flex-1">
              <div className="flex gap-4">
                {/* 左側內容區域 */}
                <div className="flex-[2.6] pr-4 pt-4">
                  <HeroSection />

                  <ForumTabs
                    tabs={[
                      { id: 'cats', label: '貓貓' },
                      { id: 'dogs', label: '狗狗' },
                      { id: 'special', label: '特寵' },
                    ]}
                    contentData={homeContentData}
                    onShowMore={handleShowMore}
                    showMoreLink="/forum/list"
                  />
                    <PopularSection
                      title="最佳人氣"
                      popularItems={homePopularItems}
                      onItemClick={handlePopularItemClick}
                      enableCardHover={true}
                    />

                </div>

                {/* 右側討論區塊 */}
                <DiscussionSidebar />
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  )
}
