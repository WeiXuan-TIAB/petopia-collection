'use client'
import { useState,useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '@/styles/globals.css'
import ForumHeader from '@/app/_components/forum/forum-header'
import PopularSection from '@/app/_components/forum/popular-section'
import ForumTabs from '@/app/_components/forum/forum-tabs'
import ListTable from '@/app/_components/forum/forum-list/list-table'
import { PetopiaPaginationV1 } from '@/app/_components/petopia-paginationV1'
import Breadcrumb from '@/app/_components/breadcrumb'
import * as motion from 'motion/react-client'

export default function ForumListPage() {
  const router = useRouter()
  
  // 分頁狀態管理
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalItems = 25 // 你的總資料筆數
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // 列表頁熱門項目資料（與首頁不同）
  const listPopularItems = [
    {
      id: 21,
      image: "../images/forum/listPopCat00.JPG",
      alt: "神秘黑貓",
      description: "黑貓的神秘魅力：破解迷信，發現黑貓的真實"
    },
    {
      id: 22,
      image: "../images/forum/listPopCat01.JPG",
      alt: "胖胖橘貓",
      description: "慵懶橘貓，胖橘其來有自，非傳說?"
    },
    {
      id: 23,
      image: "../images/forum/listPopCat02.JPG",
      alt: "喵孩好夥伴",
      description: "【真情告白】我家毛孩如何成為我最好的治癒夥伴"
    }
  ];

  // 列表頁 ForumTabs 內容資料（與首頁不同）
  const homeContentData = {
    article: {
      image: "../images/forum/listTabCat01.JPG",
      alt: "文章分享",
      articles: [
        '如何撰寫優質的寵物照護文章？',
        '分享你的寵物趣事和成長故事',
        '寵物健康知識文章寫作技巧',
        '新手寵物主人必讀文章推薦',
        '經驗分享：我與寵物的溫馨時光'
      ],
      articleImages: [
        
      ],
    },
    video: {
      image: "../images/forum/listTabCat00.JPG",
      alt: "影音分享",
      articles: [
        '教你拍出超有氛圍感的毛孩照片！',
        '超萌寵物日常Vlog｜拍攝小技巧不藏私',
        '寵物美容教學！必看的實用影片推薦',
        '貓咪日常行為大解密，你不在家的那些事',
        '最暖心的寵物互動影像紀錄合集EP01！'
      ],
      articleImages: [
        '../images/forum/listTabCat02.JPG',
        '../images/forum/listTabCat03.JPG',
        '../images/forum/listTabCat04.JPG',
        '../images/forum/listTabCat05.JPG',
        '../images/forum/listTabCat06.JPG',
      ],
    },
    info: {
      image: "../images/forum/listTabCat07.JPG",
      alt: "資訊分享",
      articles: [
        '最新寵物醫療資訊與健康指南',
        '寵物用品購買指南與評測',
        '寵物保險與法規資訊更新',
        '寵物友善場所資訊分享',
        '【展覽】寵物活動與展覽最新消息'
      ],
       articleImages: [
        '../images/forum/listTabCat07.JPG',
        '../images/product/list/product-4.png',
        '../images/forum/listTabCat08.JPG',
        '../images/forum/listTabDog00.JPG',
        '../images/forum/listTab000.JPG',
      ],
    }
  };

  // 處理頁面變更
  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  // 處理熱門項目點擊（列表頁的邏輯）
  const handleListPopularItemClick = (item) => {
    const linkMap = {
    21: '/forum/article/21',  
    22: '/forum/article/22',   
    23: '/forum/article/23',
    }  
  if (linkMap[item.id]) {
    router.push(linkMap[item.id])
  } else {
    router.push(`/articles/${item.id}`)  // 原本的邏輯
  }
  }

  //處理點擊連外網
  useEffect(() => {
    const handleSpecialLinkClick = (e) => {
      // 檢查點擊的文字內容
      const clickedText = e.target.textContent?.trim()
      
      if (clickedText === '【展覽】寵物活動與展覽最新消息') {
        e.preventDefault()
        e.stopPropagation()
        // 使用原生確認對話框
        if (confirm('即將前往外部網站，是否繼續？')) {
          window.open('https://reurl.cc/A3MA6j', '_blank', 'noopener,noreferrer')
        }
      }
    } // ← 這裡需要加上右大括號

    // 監聽整個頁面的點擊事件
    document.addEventListener('click', handleSpecialLinkClick)
    
    // return 應該在這裡，不是在 handleSpecialLinkClick 函數內部
    return () => {
      document.removeEventListener('click', handleSpecialLinkClick)
    }
  }, [])


  return (
    <div className="container pt-8 pr-4 bg-[#FEF1EA]">
      <Breadcrumb />
      <div className="min-h-screen">
        <ForumHeader />
        <div className="flex-[2.6] pr-4 flex flex-col gap-8">
          <motion.div
  initial={{ opacity: 0, x: -50 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{
    duration: 1.0,
    delay: 0.6,
    ease: 'easeIn',
  }}
>
  <PopularSection 
    title="本版最佳人氣" 
    popularItems={listPopularItems}
    onItemClick={handleListPopularItemClick}
    enableCardHover={true}
    // 不傳 enableCardHover，預設為 false
  />
</motion.div>

          <ForumTabs
            tabs={[
              { id: 'article', label: 'BLOG' },
              { id: 'video', label: 'VLOG' },
              { id: 'info', label: '資訊分享' },
            ]}
            contentData={homeContentData}
            showMoreButton={false}
          />

          {/* 傳遞當前頁面給 ListTable */}
          <div data-list-start>
            <ListTable currentPage={currentPage} itemsPerPage={itemsPerPage} />
          </div>

          {/* 動態分頁元件 */}
          <div>
            <PetopiaPaginationV1
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  )
}