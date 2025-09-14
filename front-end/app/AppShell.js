'use client'
import { useState, useEffect, createContext, useContext } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Navbar from '@/app/_components/navbar'
import RightbarWrapper from '@/app/_components/rightbar-wrapper' // 新的包裝組件
import Footer from '@/app/_components/footer'
import GoTop from './_components/go-top'
import { ToastContainer } from 'react-toastify'
import { pageTitleMap } from '@/config/page-title'
import LoadingOverlay from '@/app/_components/loading-overlay'
import { motion, AnimatePresence } from 'framer-motion'

const LoadingContext = createContext(null)
export const useLoading = () => useContext(LoadingContext)

// 新增 Rightbar Context
const RightbarContext = createContext(null)
export const useRightbar = () => {
  const context = useContext(RightbarContext)
  if (!context) {
    throw new Error('useRightbar must be used within AppShell')
  }
  return context
}

export default function AppShell({ children }) {
  const [isLoading, setIsLoading] = useState(true)
  const [hydrated, setHydrated] = useState(false)
  const [isFirstLoad, setIsFirstLoad] = useState(true)
  // 新增：控制 Rightbar 顯示/隱藏的狀態
  const [isRightbarVisible, setIsRightbarVisible] = useState(false)

  const pathname = usePathname()
  const router = useRouter()

  // 首次進站控制
  useEffect(() => {
    setHydrated(true)

    if (sessionStorage.getItem('visited')) {
      setIsLoading(false)
      setIsFirstLoad(false)
    } else {
      sessionStorage.setItem('visited', 'true')
      const timer = setTimeout(() => {
        setIsLoading(false)
        setIsFirstLoad(false)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [])

  // 路由開始 → 立刻顯示 loading
  useEffect(() => {
    if (!hydrated || isFirstLoad) return
    setIsLoading(true)

    // 路由完成 → 延遲關閉 loading
    const timer = setTimeout(() => setIsLoading(false), 200)
    return () => clearTimeout(timer)
  }, [pathname, hydrated, isFirstLoad])

  // 新增：路由變化時關閉 Rightbar
  useEffect(() => {
    setIsRightbarVisible(false)
  }, [pathname])

  // 封裝 router.push / replace
  const safePush = (url) => {
    setIsLoading(true)
    router.push(url)
  }
  const safeReplace = (url) => {
    setIsLoading(true)
    router.replace(url)
  }

  // 新增：切換 Rightbar 顯示/隱藏的函數
  const toggleRightbar = () => {
    setIsRightbarVisible(prev => {
      const newState = !prev
      return newState
    })
  }

  // UI 控制
  const hideGoTopPages = [
    '/cart',
    '/cart/pay-info',
    '/cart/success',
    '/map/search',
  ]
  const hideGoTop = hideGoTopPages.includes(pathname) || pathname.startsWith('/restaurant/')
  
  // 地圖頁面的 Rightbar 控制邏輯
  const isMapPage = pathname === '/map/search'
  const shouldShowRightbar = isMapPage ? isRightbarVisible : true // 地圖頁面看狀態，其他頁面直接顯示
  const hideRightbar = isMapPage ? !shouldShowRightbar : false // 地圖頁面根據狀態，其他頁面不隱藏
  
  const hideFooter = ['/map/search'].includes(pathname)

  const segments = pathname.split('/').filter(Boolean)
  const lastSegment = segments[segments.length - 1] || ''
  const firstSegment = segments[0] || ''
  const isRestaurantDetail = firstSegment === 'restaurant' && !!segments[1]
  const isArticleDetail =
    firstSegment === 'forum' && segments[1] === 'article' && !!segments[2]
  const pageTitle = isArticleDetail
    ? pageTitleMap['article']
    : pageTitleMap[lastSegment] || '首頁'

  useEffect(() => {
    if (!hydrated) return
    if (isRestaurantDetail) return
    document.title = `${pageTitle} | Petopia`
  }, [isRestaurantDetail, pageTitle, hydrated])

  return (
    <div className="relative min-h-screen">
      <LoadingContext.Provider
        value={{ startLoading: () => setIsLoading(true), safePush, safeReplace }}
      >
        <RightbarContext.Provider
          value={{ 
            isRightbarVisible, 
            toggleRightbar, 
            closeRightbar: () => setIsRightbarVisible(false) 
          }}
        >
          <ToastContainer position="top-center" autoClose={2000} />
          <LoadingOverlay show={isLoading} />

          <AnimatePresence mode="wait">
            {!isLoading && hydrated && (
              <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {/* 傳遞 toggleRightbar 函數給 Navbar */}
                <Navbar onToggleRightbar={toggleRightbar} />
                
                {/* 根據邏輯決定是否顯示 Rightbar */}
                {!hideRightbar && (
                  <RightbarWrapper 
                    isVisible={shouldShowRightbar} 
                    onClose={() => setIsRightbarVisible(false)}
                  />
                )}
                
                {children}
                {!hideGoTop && <GoTop />}
                {!hideFooter && <Footer />}
              </motion.div>
            )}
          </AnimatePresence>
        </RightbarContext.Provider>
      </LoadingContext.Provider>
    </div>
  )
}