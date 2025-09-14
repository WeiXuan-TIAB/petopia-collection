'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import IconButton from '@/app/map/_components/btn/icon-button'
import {
  faHeart,
  faMapMarkerAlt,
  faAddressCard,
  faSearch,
  faEllipsisH,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const FriendListPage = () => {
  const [searchText, setSearchText] = useState('')

  // 好友列表資料
  const friends = [
    {
      id: 1,
      name: 'Peko 公主',
      avatar: '/images/map/friend/images/friend-4.png',
      lastMessage: '新好友！快來聊天',
      time: '今天',
      unread: 2
    },
    {
      id: 2,
      name: 'MoMo 主人',
      avatar: '/images/map/friend/images/friend-7.png',
      lastMessage: '週末要一起去狗狗公園嗎？',
      time: '9:45',
      unread: 1
    },
    {
      id: 3,
      name: '小黑 小姐',
      avatar: '/images/map/friend/images/friend-5.png',
      lastMessage: '謝謝你的零食推薦！',
      time: '昨天',
      unread: 0
    },
    {
      id: 4,
      name: '氣呸',
      avatar: '/images/map/friend/images/friend-6.png',
      lastMessage: '下次一起去公園玩吧',
      time: '週三',
      unread: 3
    }
  ]

  // 底部固定的聊天項目
  const bottomChatItem = {
    id: 'bottom',
    name: '咖啡 先生',
    avatar: '/images/map/friend/images/coffee-3.png',
    lastMessage: '',
    time: '',
    unread: 0
  }

  const handleChatClick = (friend) => {
    console.log(`點擊聊天: ${friend.name}`)
    // 這裡可以加入聊天功能或跳轉
  }


  return (
    <div className="min-h-screen bg-[#FEF1EA] flex">
      {/* 左側好友列表 */}
      <div className="w-80 bg-[#FEF1EA] shadow-sm flex flex-col border-r border-gray-200">
        {/* 頂部標題 */}
        <div className="px-4 py-4 border-b border-gray-100 bg-[#FEF1EA]">
          <h1 className="text-gray-800 text-lg font-medium">毛孩好友列表</h1>
        </div>

        {/* 搜尋欄 */}
        <div className="px-4 py-3 bg-[#FEF1EA] border-b border-gray-100">
          <div className="relative">
            <FontAwesomeIcon 
              icon={faSearch} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" 
            />
            <input
              type="text"
              placeholder="搜尋好友..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* 好友列表 */}
        <div className="flex-1 overflow-y-auto">
          {friends.map((friend) => (
            <button
              key={friend.id}
              onClick={() => handleChatClick(friend)}
              className="w-full flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-b border-gray-50 text-left"
              type="button"
              aria-label={`與 ${friend.name} 開始對話`}
            >
              {/* 好友頭像 */}
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <Image
                  src={friend.avatar}
                  alt={`${friend.name}的頭像`}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 好友資訊 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-gray-800 font-medium text-sm truncate">
                    {friend.name}
                  </h3>
                  {friend.time && (
                    <span className="text-gray-400 text-xs ml-2 flex-shrink-0">
                      {friend.time}
                    </span>
                  )}
                </div>
                {friend.lastMessage && (
                  <p className="text-gray-500 text-xs truncate">
                    {friend.lastMessage}
                  </p>
                )}
              </div>

              {/* 未讀訊息數 */}
              {friend.unread > 0 && (
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center ml-2 flex-shrink-0">
                  <span className="text-white text-xs font-medium">
                    {friend.unread > 99 ? '99+' : friend.unread}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* 底部固定的聊天項目 */}
        <div className="border-t border-gray-100">
          <button
            onClick={() => handleChatClick(bottomChatItem)}
            className="w-full flex items-center px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors text-left"
            type="button"
            aria-label={`與 ${bottomChatItem.name} 開始對話`}
          >
            {/* 頭像 */}
            <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
              <Image
                src={bottomChatItem.avatar}
                alt={`${bottomChatItem.name}的頭像`}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            </div>

            {/* 資訊 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-gray-800 font-medium text-sm">
                  {bottomChatItem.name}
                </h3>
                <button 
                  className="text-gray-400 p-1"
                  type="button"
                  aria-label="更多選項"
                  onClick={(e) => {
                    e.stopPropagation()
                    console.log('更多選項')
                  }}
                >
                  <FontAwesomeIcon icon={faEllipsisH} className="w-3 h-3" />
                </button>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* 右側主要區域 */}
      <div className="flex-1 flex flex-col">
        {/* 頂部按鈕 */}
        <div className="flex justify-end items-center px-6 py-4 bg-[#FEF1EA] border-b border-gray-100">
          <div className="flex gap-2">
            <IconButton icon={faMapMarkerAlt} />
            <IconButton icon={faHeart} />
            <IconButton defaultPressed={true} icon={faAddressCard} />
          </div>
        </div>

        {/* 中間空狀態區域 */}
        <div className="flex-1 flex flex-col items-center justify-center bg-[#FEF1EA]">
          <div className="text-center">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-500 mb-6">選擇好友開始聊天吧！</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FriendListPage