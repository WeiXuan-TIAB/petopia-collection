// components/forum/DiscussionSidebar.js
'use client'
import { useState } from 'react';
import Link from 'next/link';

export default function DiscussionSidebar() {
  const [activeTab, setActiveTab] = useState('all');

  const allDiscussionItems  = [
    "寵物能聽懂你心聲？真相大揭密！",
    "貓奴雙北一日好去處-猴硐貓村",
    "淹水苦中作樂狗狗玩開了花",
    "浪浪進校園變成校犬陪上課",
    "龜深夜逛大街逃家被員警帶回",
    "收容所缺糧，不到一天就爆滿",
    "聽話乖柴犬突性情大變",
    "守宮?蜥蜴?壁虎?我們一樣不一樣",
    "我家的鸚鵡會自己完成一幅畫",
    "爬蟲經濟崛起，都會型最適合寵物"
  ];

   const latestArticleItems = [
    "新手養貓必知的10件事",
    "狗狗訓練黃金期錯過就沒了",
    "兔子可以吃什麼蔬菜？",
    "寵物保險怎麼選最划算",
    "寵物中暑別驚慌，一招秒自救",
    "貓砂挑選指南-精準不踩雷",
    "狗狗建議多久需要健檢一次?",
    "養了一窩玄鳳可以訓練變成合唱團",
    "刺蝟:獸醫師認為難度飼養最高",
    "動物福利、動物權利的探討"
  ];

  const getCurrentItems = () => {
    return activeTab === 'all' ? allDiscussionItems : latestArticleItems;
  };
  
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  const handleItemClick = (item) => {
    // 檢查是否為特定需要連結的文章
  if (item === '新手養貓必知的10件事' && typeof window !== 'undefined') {
    window.location.href = '/forum/article/18';  // 替換成實際的文章 ID
  } else {
    console.log('點擊討論項目:', item);  // 其他項目維持原邏輯
  }
  };

  return (
    <aside className="flex-1 rounded-lg p-4 h-fit sticky top-4">
      {/* 討論標籤 */}
      <div className="flex justify-center gap-16 mb-4">
        <button 
          className={`text-xl font-bold pb-2 relative ${
            activeTab === 'all' 
              ? "text-orange-500 border-b-2 border-orange-500" 
              : "text-[var(--deep-cocoa)] hover:text-orange-400"
          }`}
          onClick={() => handleTabChange('all')}
        >
          全版討論
        </button>
        <button 
          className={`text-xl font-bold pb-2 relative ${
            activeTab === 'latest' 
              ? "text-orange-500 border-b-2 border-orange-500" 
              : "text-[var(--deep-cocoa)] hover:text-orange-400"
          }`}
          onClick={() => handleTabChange('latest')}
        >
          最新文章
        </button>
      </div>

      {/* 討論列表 */}
      <div className="space-y-3">
        {getCurrentItems().map((item, index) => (
          <button 
            key={`${activeTab}-${index}`} // 加上 activeTab 避免 key 重複
            className="text-base hover:text-orange-500 cursor-pointer border-b border-gray-100 pb-2 transition-colors"
            style={{borderBottom: '1px solid #C8B8AC'}}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </button>
        ))}
      </div>
      
      {/* 看更多按鈕 */}
      <div className="mt-4 text-right">
      <Link href="/forum/list">
        <button 
          className="text-orange-500 text-sm hover:text-orange-600 transition-colors"
        >
          + 看更多
        </button>
        </Link>
      </div>
    </aside>
  );
}