'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Image from 'next/image'
import useSWR from 'swr'
import { serverURL, apiURL } from '@/config'
import Breadcrumb from '@/app/_components/breadcrumb'
import {
  useUserProfile,
} from '@/services/rest-client/use-user'

export default function MyPostsPage() {
  const router = useRouter()
  const { member, isLoading } = useUserProfile()
  
  // 取得使用者的文章列表
  const { data: myPostsData, error } = useSWR(
    member ? `${apiURL}/forum/me/posts` : null,
    async (url) => {
      const res = await fetch(url, { credentials: 'include' })
      const data = await res.json()
      return data
    }
  )

  const [previewUrl, setPreviewUrl] = useState('/default-avatar.png')
  const [selectedPostId, setSelectedPostId] = useState(null)

  useEffect(() => {
    if (member) {
      const avatarUrl = member.avatar
        ? member.avatar.startsWith('http')
          ? `${member.avatar}&v=${Date.now()}`
          : `${serverURL}${member.avatar}?v=${Date.now()}`
        : '/default-avatar.png'
      setPreviewUrl(avatarUrl)
    }
  }, [member])

  // 前往選中的文章
  const handleGoToPost = () => {
    if (selectedPostId) {
      router.push(`/forum/article/${selectedPostId}`)
    } else {
      toast.error('請先選擇一篇文章')
    }
  }

  if (isLoading) return <div className="text-center py-10">載入中...</div>
  if (!member) return <div className="text-center py-10">請先登入會員</div>

  const postsLoading = !myPostsData && !error
  // 修正資料結構：API 回應是 {status: 'success', data: {forums: {...}}}
  const posts = myPostsData?.data?.forums?.data || []
  
  return (
    <section className="w-full px-4 pb-10 lg:pb-20">
      <div className="container mx-auto md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
        <Breadcrumb />
        <div className="flex flex-col justify-center align-start bg-white/70 p-4 xl:p-8 rounded-4xl">
          <h1 className="text-3xl text-center mb-4">我的創作</h1>

          {/* 頭像顯示區（只顯示，不可編輯） */}
          <div className="flex flex-col items-center mb-6">
            <Image
              width={160}
              height={160}
              src={previewUrl}
              alt="avatar preview"
              className="w-40 h-40 rounded-full mb-2 border-4 border-purple-300 shadow-2xl"
            />
          </div>

          {/* 基本資料顯示 */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="py-2 flex items-center select-none font-medium">
                姓名
              </label>
              <div className="w-full bg-gray-100 rounded-full px-4 py-2 text-gray-700">
                {member.name || '未設定'}
              </div>
            </div>

            <div className="flex flex-col">
              <label className="py-2 flex items-center select-none font-medium">
                暱稱
              </label>
              <div className="w-full bg-gray-100 rounded-full px-4 py-2 text-gray-700">
                {member.nickname || '未設定'}
              </div>
            </div>

            {/* 創作列表 - 卡片式 */}
            <div className="flex flex-col">
              <label className="py-2 flex items-center select-none font-medium">
                我的創作列表
                {posts.length > 0 && (
                  <span className="ml-2 text-sm text-gray-500">
                    (共 {posts.length} 篇)
                  </span>
                )}
              </label>
              
              {postsLoading ? (
                <div className="w-full border border-gray-300 rounded-3xl px-4 py-8 text-center text-gray-500">
                  載入文章中...
                </div>
              ) : posts.length > 0 ? (
                <div className="space-y-3">
                  {posts.map((post, index) => (
                    <button
                      key={post.id}
                      onClick={() => setSelectedPostId(post.id)}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedPostId === post.id
                          ? 'border-orange-500 bg-orange-50 shadow-md'
                          : 'border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm'
                      }`}
                    >
                      {/* 文章編號和標題 */}
                      <div className="flex items-center gap-2">
                        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          selectedPostId === post.id
                            ? 'bg-orange-500 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}>
                          {index + 1}
                        </span>
                        <h3 className={`font-medium ${
                          selectedPostId === post.id ? 'text-orange-700' : 'text-gray-800'
                        }`}>
                          {post.title}
                        </h3>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="w-full border-2 border-dashed border-gray-300 rounded-3xl px-4 py-12 text-center">
                  <div className="text-gray-400 mb-2">📝</div>
                  <p className="text-gray-500">朋友!要來發篇曠世巨作了嗎?</p>
                  <p className="text-sm text-gray-400 mt-2">創作即滋養、下筆如有神！</p>
                </div>
              )}
              
              <p className="text-gray-500 text-sm mt-2 px-2">
                {posts.length > 0 
                  ? '創作即滋養、下筆如有神！'
                  : '開始你的創作之旅吧！'
                }
              </p>
            </div>

            <div className="w-full border-b-4 border-brand-warm/40 border-dotted"></div>
            
            <button
              type="button"
              onClick={handleGoToPost}
              disabled={!selectedPostId || posts.length === 0}
              className="inline-block px-4 py-2 bg-primary hover:bg-brand-warm disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 text-white rounded-full"
            >
              {selectedPostId ? '前往選中的文章' : '請先選擇文章'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}