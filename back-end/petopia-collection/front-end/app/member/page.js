'use client'

import { useAuthGet, useAuthLogout } from '@/services/rest-client/use-user'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { serverURL } from '@/config'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Breadcrumb from '@/app/_components/breadcrumb'

export default function MemberDashboard() {
  const { user, isLoading } = useAuthGet()
  const { logout } = useAuthLogout()
  const router = useRouter()

  const [avatarVersion, setAvatarVersion] = useState(0)
  useEffect(() => {
    if (user?.avatar) setAvatarVersion(Date.now())
  }, [user?.avatar])

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith('http')
      ? `${user.avatar}?v=${avatarVersion}`
      : `${serverURL}${user.avatar}?v=${avatarVersion}`
    : '/default-avatar.png'

  const handleLogout = async () => {
    await logout()
    toast.success('已登出')
    router.push('/member/login')
  }

  if (isLoading) return <div className="p-6">載入中...</div>

  return (
    <div className="container max-w-3xl mx-auto p-6">
      <Breadcrumb />
      <h1 className="text-3xl text-center mb-4">會員中心</h1>

      {/* 會員資訊 */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 p-4 bg-white/50 rounded-lg">
        {/* <Image
          src={avatarUrl}
          width={64}
          height={64}
          alt="Avatar"
          className="w-16 h-16 rounded-full border"
        /> */}
        <Image
          src={avatarUrl}
          width={64}
          height={64}
          alt="Avatar"
          className="w-16 h-16 rounded-full border"
          onError={(e) => {
            e.currentTarget.src = 'http://localhost:3000/default-avatar.png'
          }}
        />
        <div className="flex-1">
          <p className="text-center md:text-start text-lg font-semibold">
            {user?.nickname || '會員'}
          </p>
          <p className="text-gray-500">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          登出
        </button>
      </div>

      {/* 功能連結 */}
      <div className="grid gap-4">
        <Link
          href="/member/profile"
          className="block p-4 rounded-lg bg-white/50 hover:bg-white/70 transition"
        >
          個人資料管理
        </Link>
        <Link
          href="/member/profile-password"
          className="block p-4 rounded-lg bg-white/50 hover:bg-white/70 transition"
        >
          修改密碼
        </Link>
        {/* <Link
          href="/member/orders"
          className="block p-4 rounded-lg bg-white/50 hover:bg-white/70 transition"
        >
          我的訂單
        </Link> */}
        <Link
          href="/member/favorites"
          className="block p-4 rounded-lg bg-white/50 hover:bg-white/70 transition"
        >
          我的收藏
        </Link>
        <Link
          href="/member/reservations"
          className="block p-4 rounded-lg bg-white/50 hover:bg-white/70 transition"
        >
          我的餐廳訂位
        </Link>
        <Link
          href="/forum/member"
          className="block p-4 rounded-lg bg-white/50 hover:bg-white/70 transition"
        >
          我的創作
        </Link>
      </div>
    </div>
  )
}
