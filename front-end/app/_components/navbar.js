'use client'

import { useState, useEffect } from 'react'
import { FaUser, FaShoppingCart, FaTimes } from 'react-icons/fa'
import { FaBars, FaChevronDown } from 'react-icons/fa6'
import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { createPortal } from 'react-dom'
import { useAuthGet, useAuthLogout } from '@/services/rest-client/use-user'
import { toast } from 'react-toastify'
import { serverURL } from '@/config'
import { useCart } from '@/hooks/use-cart-state/cart-provider'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/app/_components/ui/navigation-menu'

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/app/_components/ui/dropdown-menu'

import { motion, AnimatePresence } from 'framer-motion'

export default function Navbar() {
  const {items} = useCart()
  const { isAuth, user, mutate } = useAuthGet()
  const { logout } = useAuthLogout()

  const [isClient, setIsClient] = useState(false)
  useEffect(() => setIsClient(true), [])

const handleLogout = async () => {
  toast.promise(
    logout().then(() => {
      mutate(null, false)
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }),
    {
      pending: '正在登出...',
      success: '已成功登出',
      error: '登出失敗，請稍後再試',
    }
  )
}


  // 維護 avatar 版本號，避免快取
  const [avatarVersion, setAvatarVersion] = useState(0)
  useEffect(() => {
    if (user?.avatar) {
      setAvatarVersion(Date.now())
    }
  }, [user?.avatar])

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith('http')
      ? `${user.avatar}?v=${avatarVersion}`
      : `${serverURL}${user.avatar}?v=${avatarVersion}`
    : null

  // 控制 DropdownMenu 與 Mobile Menu 開關
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 flex flex-row justify-between items-center px-4 py-2 lg:px-8 bg-background-primary/80 backdrop-blur">
        {/* Logo */}
        <div className="flex grow">
          <Link href="/" className="logo text-3xl font-semibold">
            <span className="text-primary">Pet</span>
            <span className="text-brand-warm">opia</span>
          </Link>
        </div>

        {/* Desktop Navbar */}
        <div className="hidden xl:flex flex-nowrap items-center">
          <NavigationMenu className="relative z-10 flex w-screen justify-center">
            <NavigationMenuList className="center m-0 flex list-none px-2">
              {/* 會員選單 */}
              <NavigationMenuItem>
                <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
                  <DropdownMenuTrigger className="group flex select-none items-center justify-between gap-1 rounded px-3 py-2 outline-none text-base">
                    {avatarUrl ? (
                      <Image
                        key={avatarUrl}
                        width={32}
                        height={32}
                        src={avatarUrl}
                        alt="avatar"
                        className="w-8 h-8 rounded-full border border-gray-300 me-2"
                      />
                    ) : (
                      <FaUser className="me-2" />
                    )}
                    {isClient && isAuth ? user?.nickname || '會員' : '會員'}
                    <FaChevronDown
                      className={`w-3.5 h-3.5 ms-1 transition-transform duration-300 ${
                        menuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="flex flex-col gap-x-2.5 w-auto bg-white rounded-lg p-2 shadow-lg divide-y">
                    {!isClient || !isAuth ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/member/login"
                            className="flex justify-center w-full px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors duration-300 cursor-pointer"
                          >
                            登入
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/member/register"
                            className="flex justify-center w-full px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors duration-300 cursor-pointer"
                          >
                            註冊
                          </Link>
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem asChild>
                          <Link
                            href="/member"
                            className="flex justify-center w-full px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors duration-300 cursor-pointer lg:text-base"
                          >
                            會員中心
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <button
                            onClick={handleLogout}
                            className="flex justify-center w-full px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors duration-300 text-base"
                          >
                            登出
                          </button>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink
                  href="/cart"
                  className="flex justify-center items-center px-4 py-2 hover:bg-primary/10 rounded-lg transition-colors duration-300"
                >
                  <FaShoppingCart className="me-2" />
                  {items.length >0 ? `購物車(${items.length})`:'購物車'}
                  
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

{/* Mobile Icons (Cart + Hamburger) */}
<div className="flex xl:hidden items-center gap-3">
  {/* 購物車按鈕 */}
  <Link
    href="/cart"
    className="relative p-3 rounded-lg bg-primary text-background-secondary hover:bg-brand-warm/80 transition-colors duration-300"
  >
    <FaShoppingCart />
    {items.length > 0 && (
      <span className="absolute -top-1 -right-1 border-2 border-border-primary bg-white text-primary text-xs rounded-full px-1">
        {items.length}
      </span>
    )}
  </Link>

  {/* 漢堡按鈕 */}
  <button
    className="p-3 rounded-lg bg-primary text-background-secondary hover:bg-brand-warm/80 transition-colors duration-300"
    onClick={() => setMobileMenuOpen(true)}
  >
    <FaBars />
  </button>
</div>

      </div>

      {/* Fullpage Menu (Portal to body) */}
      {isClient &&
        createPortal(
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 w-screen h-screen z-[9999] flex flex-col items-center justify-center bg-primary/90 text-white backdrop-blur"
              >
                {/* Close Button */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-5 right-14"
                >
                  <FaTimes size={28} />
                </button>

                <ul className="space-y-6 text-2xl text-center">
                  <li>
                    <Link
                      href="/product"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      買買
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/travel"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      玩玩
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/restaurant"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      吃吃
                    </Link>
                  </li>
                  <li>
                    <Link href="/map" onClick={() => setMobileMenuOpen(false)}>
                      逛逛
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/forum"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      聊聊
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/member"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      會員中心
                    </Link>
                  </li>
                </ul>

                {/* User Info */}
                <div className="mt-12 text-center">
                  {isAuth ? (
                    <>
                      <p className="mb-4">Hi, {user?.nickname || user?.name}</p>
                      <button
                        onClick={() => {
                          handleLogout()
                          setMobileMenuOpen(false)
                        }}
                        className="px-4 py-2 bg-white text-primary rounded-full"
                      >
                        登出
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/member/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2 bg-white text-primary rounded-full"
                    >
                      登入
                    </Link>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
