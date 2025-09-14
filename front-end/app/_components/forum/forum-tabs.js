// components/forum/ForumTabs.js
'use client'
import { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import * as motion from 'motion/react-client'
import Link from 'next/link'

export default function ForumTabs({
  tabs = [
    { id: 'cats', label: '貓貓' },
    { id: 'dogs', label: '狗狗' },
    { id: 'special', label: '特寵' },
  ],
  contentData = {}, // 從外部傳入的內容資料
  onShowMore, // 看更多按鈕的回調函數
  showMoreLink = '/forum/list', // 看更多按鈕的連結
  showMoreButton = true,
}) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'cats') //tabs
  const [hoverImage, setHoverImage] = useState(null) //pics更動

  const handleShowMore = () => {
    if (onShowMore) {
      onShowMore(activeTab)
    }
  }

  // 預設內容資料
  const defaultContentData = {
    cats: {
      image: '',
      alt: '',
      articles: [],
      articleImages: [],
    },
    dogs: {
      image: '',
      alt: '',
      articles: [],
      articleImages: [],
    },
    special: {
      image: '',
      alt: '',
      articles: [],
      articleImages: [],
    },
    // 列表頁的內容
    article: {
      image:
        'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=192&h=128&fit=crop',
      alt: '文章分享',
      articles: [
        '如何撰寫優質的寵物照護文章？',
        '分享你的寵物趣事和成長故事',
        '寵物健康知識文章寫作技巧',
        '新手寵物主人必讀文章推薦',
        '經驗分享：我與寵物的溫馨時光',
      ],
    },
    video: {
      image:
        'https://images.unsplash.com/photo-1516832970803-325be7a92ae8?w=192&h=128&fit=crop',
      alt: '影音分享',
      articles: [
        '寵物訓練影片製作分享',
        '可愛寵物日常 Vlog 拍攝技巧',
        '寵物美容教學影片推薦',
        '寵物行為觀察紀錄影片',
        '與寵物互動的溫馨影像記錄',
      ],
    },
    info: {
      image:
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=192&h=128&fit=crop',
      alt: '資訊分享',
      articles: [
        '最新寵物醫療資訊與健康指南',
        '寵物用品購買指南與評測',
        '寵物保險與法規資訊更新',
        '寵物友善場所資訊分享',
        '寵物活動與展覽最新消息',
      ],
    },
  }

  // 根據不同標籤顯示不同內容
  const getTabContent = (tabId) => {
    // 優先使用傳入的資料，否則使用預設資料
    const allContentData =
      Object.keys(contentData).length > 0 ? contentData : defaultContentData
    return (
      allContentData[tabId] || allContentData.cats || defaultContentData.cats
    )
  }

  const currentContent = getTabContent(activeTab)

  // 新增：處理文章項目的渲染（支援字串和物件）
  const renderArticleItem = (article, index) => {
    // 判斷是字串還是物件
    const isString = typeof article === 'string'
    const text = isString ? article : article.title
    const hasLink = !isString && article.hasLink && article.id
    
    // ***超實用!新增：檢查是否為特定需要連結的文章
    const isSpecialLinkArticle = text === '帶狗狗戶外探險必知安全守則活動小技巧'
  
    const handleArticleClick = () => {
      if (isSpecialLinkArticle && typeof window !== 'undefined') {
        window.location.href = '/forum/article/16'
      }
    }


    const motionDiv = (
      <motion.div
        key={`${activeTab}-${index}`}
        initial={{ opacity: 0, x: 20, scale: 0 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5 + index * 0.07, // 錯開動畫時間
          x: { duration: 0.15, ease: "easeOut" }
        }}
        className="text-base hover:text-[var(--puppy-orange)] cursor-pointer pb-2 transition-colors"
        style={{ borderBottom: '1px solid #C8B8AC' }}
        onClick={isSpecialLinkArticle ? handleArticleClick : undefined}
        //pics更動
        onMouseEnter={() => {
          if (
            currentContent.articleImages &&
            currentContent.articleImages[index]
          ) {
            setHoverImage({
              image: currentContent.articleImages[index],
              alt: `${currentContent.alt} - ${text.substring(
                0,
                10
              )}...`,
            })
          }
        }}
        onMouseLeave={() => setHoverImage(null)}
        whileHover={{ x: 10, transition: { duration: 0.15 } }} // 滑鼠懸停時輕微移動
      >
        {text}
      </motion.div>
    )

    // 如果有連結，用 Link 包裹
    if (hasLink) {
      return (
        <Link key={`${activeTab}-${index}`} href={`/forum/article/${article.id}`}>
          {motionDiv}
        </Link>
      )
    }

    // 沒有連結就直接返回
    return motionDiv
  }

  return (
    <motion.section
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 2.0,
      }}
    >
      <div className="flex gap-8 mb-4 border-b border-[#C8B8AC] relative">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            className={`text-xl relative pb-2 ${
              activeTab === tab.id
                ? 'text-[var(--puppy-orange)]'
                : 'text-[--deep-cocoa] hover:text-[var(--puppy-orange)]'
            }`}
            onClick={() => setActiveTab(tab.id)}
            initial={false}
            animate={{
              color:
                activeTab === tab.id
                  ? 'var(--puppy-orange)'
                  : 'var(--deep-cocoa)',
            }}
            transition={{ duration: 0.2 }}
          >
            {tab.label}
            {/* 底線動畫 */}
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--puppy-orange)]"
                layoutId="activeTab"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Content Area - 文章內容區with動畫 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg flex gap-4"
        >
          {/* 左側圖片 */}
          <AnimatePresence mode="wait">
            <motion.img
              key={
                hoverImage ? `hover-${hoverImage.alt}` : `active-${activeTab}`
              }
              src={hoverImage ? hoverImage.image : currentContent.image}
              alt={hoverImage ? hoverImage.alt : currentContent.alt}
              className="w-64 h-48 bg-gray-200 rounded-4xl object-cover"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>

          {/* 右側文章列表 */}
          <div className="flex-1">
            <div className="space-y-3">
              {currentContent.articles.map((article, index) => 
                renderArticleItem(article, index)
              )}

              {/* 看更多按鈕 */}
              {showMoreButton && (
                <Link href={showMoreLink}>
                  <motion.div
                    className="pt-3 text-right"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    <motion.button
                      className="text-orange-500 text-sm hover:text-orange-600 transition-colors"
                      onClick={handleShowMore}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      + 看更多
                    </motion.button>
                  </motion.div>
                </Link>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  )
}