'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { FaSearch } from 'react-icons/fa'
import { useAuth } from '@/hooks/use-auth'

// 你可以把這個移到單獨的檔案，或從你的 forum-search 頁面引入
const mockArticles = [
  {
    id: 1,
    title: '可愛貓咪的日常飼養指南',
    content: '貓咪是非常可愛的寵物，需要適當的營養和日常互動......',
    category: '貓',
    tags: ['可愛', '貓', '飼養'],
    likes: 567,
    date: '2024-07-23',
  },
  {
    id: 2,
    title: '調皮狗狗的訓練技巧',
    content: '家裡的狗狗很調皮怎麼辦？這裡分享一些實用的訓練方法......',
    category: '狗',
    tags: ['狗', '調皮', '訓練'],
    likes: 999,
    date: '2024-08-12',
  },
  {
    id: 3,
    title: '守宮飼養環境設置',
    content: '守宮需要特殊的環境設置，溫度和濕度都很重要......',
    category: '特寵',
    tags: ['守宮', '環境'],
    likes: 234,
    date: '2024-06-15',
  },
  {
    id: 4,
    title: '小鳥互動遊戲推薦',
    content: '鳥類也需要互動和娛樂，這裡推薦一些適合的遊戲......',
    category: '特寵',
    tags: ['鳥類', '互動'],
    likes: 456,
    date: '2024-08-03',
  },
  {
    id: 5,
    title: '貓咪挑食問題解決',
    content: '很多貓咪都有挑食的問題，這篇文章分享解決方法......',
    category: '貓',
    tags: ['貓', '飲食'],
    likes: 789,
    date: '2024-07-08',
  },
  {
    id: 6,
    title: '狗狗基礎訓練教學',
    content: '基礎的服從訓練是每隻狗狗都應該學會的技能......',
    category: '狗',
    tags: ['狗', '訓練'],
    likes: 888,
    date: '2024-08-16',
  },
  {
    id: 7,
    title: '兔子照護注意事項',
    content: '兔子是很受歡迎的寵物，但照護方式和貓狗有很大不同......',
    category: '特寵',
    tags: ['兔子', '照護'],
    likes: 2,
    date: '2024-06-28',
  },
  {
    id: 8,
    title: '貓咪行為解析',
    content: '了解貓咪的各種行為含義，幫助主人更好地理解愛貓......',
    category: '貓',
    tags: ['貓', '行為'],
    likes: 345,
    date: '2024-07-30',
  },
  {
    id: 9,
    title: '幼犬疫苗接種時程',
    content: '幼犬的疫苗接種關係到健康，了解正確的接種時程很重要......',
    category: '狗',
    tags: ['狗', '幼犬', '疫苗'],
    likes: 777,
    date: '2024-08-05',
  },
  {
    id: 10,
    title: '倉鼠飼養基礎指南',
    content: '倉鼠是小朋友很喜歡的寵物，飼養前要了解基本知識......',
    category: '特寵',
    tags: ['倉鼠', '飼養'],
    likes: 623,
    date: '2024-06-11',
  },
  {
    id: 11,
    title: '貓咪美容護理技巧',
    content: '定期的美容護理讓貓咪保持健康美麗的外觀......',
    category: '貓',
    tags: ['貓', '美容', '護理'],
    likes: 412,
    date: '2024-08-14',
  },
  {
    id: 12,
    title: '狗狗散步注意事項',
    content: '每天的散步對狗狗很重要，但要注意安全和禮儀......',
    category: '狗',
    tags: ['狗', '散步', '運動'],
    likes: 666,
    date: '2024-07-19',
  },
  {
    id: 13,
    title: '天竺鼠的飲食管理',
    content: '天竺鼠對維生素C的需求很高，飲食管理要特別注意......',
    category: '特寵',
    tags: ['天竺鼠', '飲食'],
    likes: 298,
    date: '2024-08-01',
  },
  {
    id: 14,
    title: '貓咪健康檢查重點',
    content: '定期的健康檢查能早期發現問題，確保貓咪健康......',
    category: '貓',
    tags: ['貓', '健康', '檢查'],
    likes: 534,
    date: '2024-06-22',
  },
  {
    id: 15,
    title: '大型犬飼養須知',
    content: '大型犬需要更多空間和運動量，飼養前要做好準備......',
    category: '狗',
    tags: ['狗', '大型犬'],
    likes: 555,
    date: '2024-08-09',
  },
  {
    id: 16,
    title: '鸚鵡學說話訓練法',
    content: '想讓鸚鵡學會說話嗎？這裡有一些有效的訓練方法......',
    category: '特寵',
    tags: ['鸚鵡', '訓練', '說話'],
    likes: 671,
    date: '2024-07-14',
  },
  {
    id: 17,
    title: '貓咪換毛期照護',
    content: '換毛期間貓咪需要特別的照護，避免毛球症的發生......',
    category: '貓',
    tags: ['貓', '換毛', '照護'],
    likes: 389,
    date: '2024-08-11',
  },
  {
    id: 18,
    title: '狗狗社會化訓練',
    content: '良好的社會化讓狗狗更容易適應環境和與其他動物相處......',
    category: '狗',
    tags: ['狗', '社會化', '訓練'],
    likes: 444,
    date: '2024-06-05',
  },
  {
    id: 19,
    title: '刺蝟飼養環境設置',
    content: '刺蝟需要溫暖安靜的環境，設置時要注意溫度控制......',
    category: '特寵',
    tags: ['刺蝟', '環境'],
    likes: 156,
    date: '2024-07-27',
  },
  {
    id: 20,
    title: '老年貓咪特殊照護',
    content: '老年貓咪需要更細心的照顧，了解其特殊需求很重要......',
    category: '貓',
    tags: ['貓', '老年', '照護'],
    likes: 723,
    date: '2024-08-15',
  },
  {
    id: 21,
    title: '狗狗牙齒保健方法',
    content: '狗狗的牙齒健康很重要，定期清潔和檢查不可少......',
    category: '狗',
    tags: ['狗', '牙齒', '保健'],
    likes: 333,
    date: '2024-06-30',
  },
  {
    id: 22,
    title: '龍貓飼養注意事項',
    content: '龍貓對環境要求很高，飼養前要了解其特殊需求......',
    category: '特寵',
    tags: ['龍貓', '飼養'],
    likes: 445,
    date: '2024-08-07',
  },
  {
    id: 23,
    title: '貓咪玩具選擇指南',
    content: '適合的玩具能讓貓咪保持活力，選擇時要注意安全性......',
    category: '貓',
    tags: ['貓', '玩具', '娛樂'],
    likes: 612,
    date: '2024-07-02',
  },
  {
    id: 24,
    title: '狗狗夏季消暑對策',
    content: '夏天炎熱，狗狗容易中暑，要做好消暑和防護措施......',
    category: '狗',
    tags: ['狗', '夏季', '消暑'],
    likes: 222,
    date: '2024-08-13',
  },
  {
    id: 25,
    title: '蜜袋鼯飼養心得分享',
    content: '蜜袋鼯是夜行性動物，飼養時要了解其生活習性......',
    category: '特寵',
    tags: ['蜜袋鼯', '飼養'],
    likes: 178,
    date: '2024-06-18',
  },
  {
    id: 26,
    title: '貓咪抓板選擇技巧',
    content: '貓抓板是貓咪的必需品，選擇合適的材質和尺寸很重要......',
    category: '貓',
    tags: ['貓', '抓板', '用品'],
    likes: 367,
    date: '2024-07-25',
  },
  {
    id: 27,
    title: '狗狗冬季保暖措施',
    content: '冬天寒冷，某些品種的狗狗需要額外的保暖措施......',
    category: '狗',
    tags: ['狗', '冬季', '保暖'],
    likes: 111,
    date: '2024-08-04',
  },
  {
    id: 28,
    title: '變色龍飼養環境要求',
    content: '變色龍對溫度和濕度要求嚴格，環境設置要非常仔細......',
    category: '特寵',
    tags: ['變色龍', '環境'],
    likes: 289,
    date: '2024-06-08',
  },
  {
    id: 29,
    title: '貓咪洗澡注意事項',
    content: '大部分貓咪不喜歡洗澡，但有時還是需要，要注意方法......',
    category: '貓',
    tags: ['貓', '洗澡', '清潔'],
    likes: 456,
    date: '2024-08-10',
  },
  {
    id: 30,
    title: '狗狗肢體語言解讀',
    content: '了解狗狗的肢體語言，能更好地理解牠們的情緒和需求......',
    category: '狗',
    tags: ['狗', '肢體語言', '行為'],
    likes: 110,
    date: '2024-07-12',
  },
  {
    id: 31,
    title: '烏龜飼養基礎知識',
    content: '烏龜壽命很長，飼養前要了解其長期照護需求......',
    category: '特寵',
    tags: ['烏龜', '飼養'],
    likes: 334,
    date: '2024-08-06',
  },
  {
    id: 32,
    title: '貓咪營養補充建議',
    content: '除了主食外，適當的營養補充能讓貓咪更健康......',
    category: '貓',
    tags: ['貓', '營養', '補充'],
    likes: 578,
    date: '2024-06-25',
  },
  {
    id: 33,
    title: '狗狗服從訓練技巧',
    content: '基本的服從指令讓狗狗更好管理，訓練時要有耐心......',
    category: '狗',
    tags: ['狗', '服從', '訓練'],
    likes: 100,
    date: '2024-07-16',
  },
  {
    id: 34,
    title: '松鼠飼養環境佈置',
    content: '松鼠活潑好動，需要足夠的活動空間和攀爬設施......',
    category: '特寵',
    tags: ['松鼠', '環境'],
    likes: 267,
    date: '2024-08-02',
  },
  {
    id: 35,
    title: '貓咪疾病預防指南',
    content: '預防勝於治療，了解常見疾病的預防方法很重要......',
    category: '貓',
    tags: ['貓', '疾病', '預防'],
    likes: 689,
    date: '2024-07-05',
  },
  {
    id: 36,
    title: '狗狗食物中毒急救',
    content: '狗狗誤食有毒食物時的緊急處理方法，飼主必須了解......',
    category: '狗',
    tags: ['狗', '中毒', '急救'],
    likes: 99,
    date: '2024-08-08',
  },
  {
    id: 37,
    title: '陸龜飼養心得分享',
    content: '陸龜需要曬太陽和適當的運動空間，飼養環境很重要......',
    category: '特寵',
    tags: ['陸龜', '飼養'],
    likes: 245,
    date: '2024-06-14',
  },
  {
    id: 38,
    title: '貓咪絕育手術須知',
    content: '絕育手術對貓咪健康有益，術前術後照護都要注意......',
    category: '貓',
    tags: ['貓', '絕育', '手術'],
    likes: 456,
    date: '2024-07-21',
  },
  {
    id: 39,
    title: '狗狗皮膚病防治',
    content: '狗狗常見的皮膚問題及其預防和治療方法介紹......',
    category: '狗',
    tags: ['狗', '皮膚病', '防治'],
    likes: 98,
    date: '2024-08-14',
  },
  {
    id: 40,
    title: '雪貂飼養注意事項',
    content: '雪貂是活潑的寵物，但需要特殊的照護和環境設置......',
    category: '特寵',
    tags: ['雪貂', '飼養'],
    likes: 123,
    date: '2024-06-03',
  },
  {
    id: 41,
    title: '貓咪睡眠習性分析',
    content: '貓咪一天大部分時間在睡覺，了解其睡眠習性很有趣......',
    category: '貓',
    tags: ['貓', '睡眠', '習性'],
    likes: 345,
    date: '2024-07-29',
  },
  {
    id: 42,
    title: '狗狗運動量規劃',
    content: '不同品種的狗狗需要不同的運動量，規劃要因狗而異......',
    category: '狗',
    tags: ['狗', '運動', '規劃'],
    likes: 567,
    date: '2024-08-12',
  },
  {
    id: 43,
    title: '蘭壽金魚飼養指南',
    content: '蘭壽是美麗的觀賞魚，但飼養需要專業的知識和技巧......',
    category: '特寵',
    tags: ['金魚', '飼養'],
    likes: 189,
    date: '2024-06-20',
  },
  {
    id: 44,
    title: '貓咪情緒管理方法',
    content: '貓咪也有情緒問題，了解如何幫助牠們調節情緒......',
    category: '貓',
    tags: ['貓', '情緒', '管理'],
    likes: 234,
    date: '2024-07-10',
  },
  {
    id: 45,
    title: '狗狗零食選擇原則',
    content: '零食是訓練的好幫手，但選擇時要注意健康和安全......',
    category: '狗',
    tags: ['狗', '零食', '選擇'],
    likes: 456,
    date: '2024-08-16',
  },
  {
    id: 46,
    title: '守宮脫皮照護指南',
    content: '守宮脫皮是正常現象，但有時需要飼主的協助......',
    category: '特寵',
    tags: ['守宮', '脫皮', '照護'],
    likes: 67,
    date: '2024-06-12',
  },
  {
    id: 47,
    title: '貓咪生產準備事項',
    content: '母貓懷孕生產時，飼主需要做好充分的準備和照護......',
    category: '貓',
    tags: ['貓', '生產', '準備'],
    likes: 789,
    date: '2024-07-18',
  },
  {
    id: 48,
    title: '狗狗老年照護要點',
    content: '老年狗狗需要更多關愛和特殊照護，延長健康壽命......',
    category: '狗',
    tags: ['狗', '老年', '照護'],
    likes: 234,
    date: '2024-08-03',
  },
  {
    id: 49,
    title: '蜘蛛飼養入門指南',
    content: '寵物蜘蛛雖然特殊，但飼養得當也是很有趣的寵物......',
    category: '特寵',
    tags: ['蜘蛛', '飼養'],
    likes: 45,
    date: '2024-06-27',
  },
  {
    id: 50,
    title: '貓咪旅行準備清單',
    content: '帶貓咪外出旅行需要充分準備，確保牠們的安全舒適......',
    category: '貓',
    tags: ['貓', '旅行', '準備'],
    likes: 53,
    date: '2024-08-15',
  },
]

export default function ForumHeader() {
  const [searchValue, setSearchValue] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [ setIsInputFocused] = useState(false)
  const router = useRouter()
  const searchContainerRef = useRef(null)

  // 使用 useAuth hook 取得登入狀態
  const { isAuth } = useAuth()

  // 即時搜尋邏輯
  useEffect(() => {
    if (searchValue.trim().length > 0) {
      const searchLower = searchValue.toLowerCase()
      const filtered = mockArticles
        .filter(
          (article) =>
            article.title.toLowerCase().includes(searchLower) ||
            article.content.toLowerCase().includes(searchLower) ||
            article.tags.some((tag) => tag.toLowerCase().includes(searchLower))
        )
        .slice(0, 3) // 只取前3筆

      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchValue])

  // 點擊外部關閉建議框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowSuggestions(false)
        setIsInputFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [setIsInputFocused])

  const handleSearch = () => {
    if (searchValue.trim()) {
      // 跳轉到搜尋頁面並傳遞搜尋參數
      const encodedSearch = encodeURIComponent(searchValue.trim())
      router.push(`/forum/forum-search?q=${encodedSearch}`)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSuggestionClick = (article) => {
    // 點擊建議項目時，可以直接跳轉到該文章或進行搜尋
    setSearchValue(article.title)
    setShowSuggestions(false)
    const encodedSearch = encodeURIComponent(article.title)
    router.push(`/forum/forum-search?q=${encodedSearch}`)
  }

  const handleInputFocus = () => {
    setIsInputFocused(true)
    if (searchValue.trim().length > 0 && suggestions.length > 0) {
      setShowSuggestions(true)
    }
  }

  const handleNewPost = async () => {
    //檢查登入狀態
    //  if (checkAuth) {
    //   await checkAuth()
    // }
    // 已登入：跳轉到創作頁面
    if (isAuth) {
      router.push('/forum/create-edit')
    } else {
      const returnUrl = encodeURIComponent('/forum/create-edit')
      // 未登入：跳轉到登入頁面
      router.push(`/member?returnUrl=${returnUrl}`) // 或你的登入頁路由
    }
  }

  return (
    <header className="p-4 px-2">
      <div className="flex justify-end items-center gap-4">
        <div ref={searchContainerRef} className="flex relative">
          <div className="relative flex-1">
            <FaSearch className="absolute left-6 top-3 text-gray-400 z-10" />
            <input
              className="border-[1.5px] border-[var(--puppy-orange)] border-r-0 rounded-l-full px-4 py-2 flex-1 pl-12 outline-none w-full"
              placeholder="請輸入關鍵字"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
            />

            {/* 搜尋建議下拉框 */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-20 mt-1">
                {suggestions.map((article) => (
                  <button
                    key={article.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSuggestionClick(article)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-gray-800 truncate">
                          {article.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">
                            {article.category}
                          </span>
                          <span className="text-xs text-gray-400">
                            👍 {article.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
                {/* 查看更多結果的提示 */}
                <div className="p-2 bg-gray-50 text-center">
                  <span className="text-xs text-gray-500">
                    按 Enter 或點擊搜尋查看更多結果
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleSearch}
            className="bg-[var(--puppy-orange)] text-white px-6 py-2 rounded-r-full border-[1.5px] border-[var(--puppy-orange)] border-l-0 flex items-center justify-center text-center hover:bg-orange-600 transition-colors"
          >
            搜尋
          </button>
        </div>

        {/* 修改後的發表新創作按鈕 */}
        <button
          className="bg-[var(--puppy-orange)] text-white px-4 py-2 rounded-full border hover:bg-orange-600 transition-colors"
          onClick={handleNewPost}
        >
          {isAuth ? '發表新創作' : '發表新創作'}
        </button>
      </div>
    </header>
  )
}
