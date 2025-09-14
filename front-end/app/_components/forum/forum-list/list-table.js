'use client'
import { useState, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa'

// 25筆測試資料
const articles = [
  {
    id: 1,
    topic: '【好食在】喵喵食堂 貓咪友善餐廳',
    userName: 'James Peng',
    publishDate: '2025/01/15',
    response: 36,
  },
  {
    id: 2,
    topic: '新手養貓必看！幼貓照護指南',
    userName: '貓咪專家',
    publishDate: '2025/01/14',
    response: 42,
  },
  {
    id: 3,
    topic: '貓咪不吃飯怎麼辦？緊急處理方法',
    userName: '貓奴小芳',
    publishDate: '2025/01/13',
    response: 55,
  },
  {
    id: 4,
    topic: '貓咪保險比較分析 2025 最新版',
    userName: '理財貓',
    publishDate: '2025/01/12',
    response: 18,
  },
  {
    id: 5,
    topic: '如何幫貓咪建立規律生活作息',
    userName: '貓奴阿文',
    publishDate: '2025/01/11',
    response: 27,
  },
  {
    id: 6,
    topic: '常見的貓咪皮膚病與預防',
    userName: '獸醫小楊',
    publishDate: '2025/01/10',
    response: 39,
  },
  {
    id: 7,
    topic: '貓咪掉毛嚴重怎麼辦？解決方案',
    userName: '鏟屎官小美',
    publishDate: '2025/01/09',
    response: 64,
  },
  {
    id: 8,
    topic: '室內養貓的必備用品清單',
    userName: '貓咪小屋',
    publishDate: '2025/01/08',
    response: 22,
  },
  {
    id: 9,
    topic: '貓咪飲食指南：乾糧 vs 濕糧',
    userName: '營養師阿貓',
    publishDate: '2025/01/07',
    response: 31,
  },
  {
    id: 10,
    topic: '如何讓貓咪減肥？健康瘦身法',
    userName: '健康貓奴',
    publishDate: '2025/01/06',
    response: 47,
  },
  {
    id: 11,
    topic: '多貓家庭相處技巧分享',
    userName: '貓奴團隊',
    publishDate: '2025/01/05',
    response: 58,
  },
  {
    id: 12,
    topic: '貓咪疫苗完整懶人包',
    userName: '獸醫小陳',
    publishDate: '2025/01/04',
    response: 15,
  },
  {
    id: 13,
    topic: '如何幫貓咪刷牙？牙齒保健技巧',
    userName: '牙醫貓奴',
    publishDate: '2025/01/03',
    response: 44,
  },
  {
    id: 14,
    topic: '貓咪打架怎麼辦？行為糾正方法',
    userName: '行為訓練師',
    publishDate: '2025/01/02',
    response: 52,
  },
  {
    id: 15,
    topic: '貓咪抓沙發解決方法',
    userName: '家俱救星',
    publishDate: '2025/01/01',
    response: 37,
  },
  {
    id: 16,
    topic: '幼貓換牙期注意事項',
    userName: '貓奴阿芳',
    publishDate: '2024/12/31',
    response: 23,
  },
  {
    id: 17,
    topic: '如何選擇適合的貓砂？',
    userName: '養貓顧問',
    publishDate: '2024/12/30',
    response: 41,
  },
  {
    id: 18,
    topic: '貓咪常見寄生蟲與驅蟲方法',
    userName: '獸醫小張',
    publishDate: '2024/12/29',
    response: 33,
  },
  {
    id: 19,
    topic: '貓咪壓力來源與舒緩方法',
    userName: '心理貓奴',
    publishDate: '2024/12/28',
    response: 46,
  },
  {
    id: 20,
    topic: '如何和膽小的貓咪建立信任感',
    userName: '耐心鏟屎官',
    publishDate: '2024/12/27',
    response: 53,
  },
  {
    id: 21,
    topic: '貓咪便秘怎麼辦？改善飲食建議',
    userName: '健康顧問',
    publishDate: '2024/12/26',
    response: 38,
  },
  {
    id: 22,
    topic: '長毛貓梳毛技巧與工具推薦',
    userName: '貓咪造型師',
    publishDate: '2024/12/25',
    response: 29,
  },
  {
    id: 23,
    topic: '如何挑選適合的貓窩？',
    userName: '居家貓奴',
    publishDate: '2024/12/24',
    response: 21,
  },
  {
    id: 24,
    topic: '貓咪老化徵兆與照護方式',
    userName: '銀髮貓守護者',
    publishDate: '2024/12/23',
    response: 35,
  },
  {
    id: 25,
    topic: '貓咪最愛的互動玩具推薦',
    userName: '玩具達人',
    publishDate: '2024/12/22',
    response: 49,
  },
]

export default function ListTable({ currentPage = 1, itemsPerPage = 5 }) {
  const router = useRouter()
  
  // 排序狀態
  const [sortConfig, setSortConfig] = useState({
    key: 'publishDate',
    direction: 'desc',
  })

  // 處理點擊跳轉 - 移到組件內部並使用 useCallback
  const handleRowClick = useCallback((article) => {
    if (article.id === 1) {
      router.push('/restaurant/1')
    }
    // 可以加上其他邏輯
    // else {
    //   router.push(`/forum/article/${article.id}`)
    // }
  }, [router])

  // 排序邏輯
  const sortedArticles = useMemo(() => {
    let sortableArticles = [...articles]

    if (sortConfig.key === 'publishDate') {
      sortableArticles.sort((a, b) => {
        const aDate = new Date(a.publishDate.replace(/\//g, '-'))
        const bDate = new Date(b.publishDate.replace(/\//g, '-'))
        return sortConfig.direction === 'asc' ? aDate - bDate : bDate - aDate
      })
    }
    return sortableArticles
  }, [sortConfig])

  // 計算當前頁面要顯示的資料
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentArticles = sortedArticles.slice(startIndex, endIndex)

  // 排序處理函數
  const handleSort = useCallback((key) => {
    if (key !== 'publishDate') return

    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  // 取得排序圖標
  const getSortIcon = useCallback((columnKey) => {
    if (columnKey !== 'publishDate') return null

    if (sortConfig.key !== columnKey) {
      return <FaSort className="ml-1 text-gray-400" />
    }
    return sortConfig.direction === 'asc' ? (
      <FaSortUp className="ml-1 text-white" />
    ) : (
      <FaSortDown className="ml-1 text-white" />
    )
  }, [sortConfig])

  return (
    <div className="overflow-x-auto">
      {/* 獨立的圓角表頭 */}
      <div className="bg-brand-warm rounded-4xl mb-2">
        <div className="flex">
          <div className="w-1/2 px-6 py-3 text-left text-base font-medium text-text-light uppercase tracking-wider">
            標題
          </div>
          <div className="w-1/4 px-6 py-3 text-left text-base font-medium text-text-light uppercase tracking-wider">
            發文者
          </div>
          <div className="w-1/4 px-6 py-3 text-left text-base font-medium text-text-light uppercase tracking-wider">
            <button
              onClick={() => handleSort('publishDate')}
              className="flex items-center hover:text-white transition-colors"
            >
              發布時間
              {getSortIcon('publishDate')}
            </button>
          </div>
          <div className="w-1/4 px-6 py-3 text-center text-base font-medium text-text-light uppercase tracking-wider">
            回覆數
          </div>
        </div>
      </div>

      {/* 表格主體 */}
      <div className="space-y-2">
        {currentArticles.map((article) => (
          <button
            key={article.id}
            onClick={() => handleRowClick(article)}
            className={`flex py-2 border-b border-gray-200 transition-colors ${
              article.id === 1
                ? 'hover:bg-orange-50 cursor-pointer'
                : 'hover:bg-gray-50 cursor-pointer'
            }`}
          >
            <div className="w-1/2 px-6 py-2 text-base font-medium text-text-primary">
              {article.topic}
            </div>
            <div className="w-1/4 px-6 py-2 text-base text-text-primary">
              {article.userName}
            </div>
            <div className="w-1/4 px-6 py-2 text-base text-text-primary">
              {article.publishDate}
            </div>
            <div className="w-1/4 px-6 py-2 text-base text-text-primary text-center">
              {article.response}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}