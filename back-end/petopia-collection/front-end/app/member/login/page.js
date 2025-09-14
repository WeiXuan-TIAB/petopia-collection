'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/use-auth'
import {
  useAuthGet,
  useAuthLogin,
} from '@/services/rest-client/use-user'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaEyeSlash, FaEye } from 'react-icons/fa6'

// Firebase
import { auth, googleProvider } from '@/app/firebase'
import { signInWithPopup } from 'firebase/auth'

// API config
import { apiURL } from '@/config'

import GoogleLoginButton from '../_components/google-login-button'

export default function MemberLoginPage() {
  const [userInput, setUserInput] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const { mutate } = useAuthGet()
  const { login } = useAuthLogin()
  const { isAuth } = useAuth()

  // === Regex ===
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,12}$/

  const handleFieldChange = (e) => {
    setUserInput((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  // === Email 驗證 ===
  const handleEmailBlur = () => {
    if (userInput.email && !emailRegex.test(userInput.email)) {
      setErrors((prev) => ({ ...prev, email: 'Email 格式不正確' }))
    }
  }

  // === Password 驗證 ===
  const handlePasswordBlur = () => {
    if (userInput.password && !passwordRegex.test(userInput.password)) {
      setErrors((prev) => ({
        ...prev,
        password: '密碼格式不符 (需含字母、數字、符號，6-12碼)',
      }))
    }
  }

  /** 一般帳號密碼登入 */
  const handleLogin = async () => {
    if (isAuth) {
      toast.error('錯誤 - 會員已登入')
      return
    }

    // === 格式檢查 ===
    const newErrors = {}
    if (!userInput.email.trim()) {
      newErrors.email = 'Email 為必填'
    } else if (!emailRegex.test(userInput.email)) {
      newErrors.email = 'Email 格式不正確'
    }

    if (!userInput.password.trim()) {
      newErrors.password = '密碼為必填'
    } else if (!passwordRegex.test(userInput.password)) {
      newErrors.password = '密碼格式不符 (需含字母、數字、符號，6-12碼)'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const res = await login(userInput)
    const resData = await res.json()

    if (resData?.status === 'success') {
      await mutate()
      toast.success('已成功登入', {
        autoClose: 1000,
        onClose: () => {
          router.push(redirect)
        },
      })
      router.push(redirect)
    } else {
      toast.error(`登入失敗`)
    }
  }

  /** Google 登入 */
  const handleGoogleLogin = async () => {
    try {
      googleProvider.setCustomParameters({ prompt: 'select_account' })
      const result = await signInWithPopup(auth, googleProvider)
      const idToken = await result.user.getIdToken()

      const res = await fetch(`${apiURL}/auth/google-firebase`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ idToken }),
      })

      const data = await res.json()

      if (data.status === 'success') {
        if (data.data.boundExisting) {
          toast.info('Google 已綁定到您的現有帳號')
        }
        toast.success('Google 登入成功', {
          autoClose: 1000,
          onClose: () => {
            router.push(redirect)
          },
        })
        router.push(redirect)
        await mutate()
      } else {
        toast.error(`Google 登入失敗: ${data.message || ''}`)
      }
    } catch (err) {
      console.error(err)
      toast.error('Google 登入發生錯誤')
    }
  }

  /** 快速帶入 DEMO 資料 */
  const handleQuickFill = () => {
    setUserInput({
      email: 'tw.james.peng@gmail.com',
      password: 'P@ssw0rd',
    })
    setErrors({})
    // toast.info('已帶入 DEMO 測試資料')
  }

  return (
    <section className="w-full px-4 pb-10 lg:pb-20">
      <div className="container mx-auto md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
        <div className="flex flex-col justify-center align-start mt-10 bg-white/70 p-4 xl:p-8 rounded-4xl">
          <div className="relative">
            <h1 className="text-3xl text-center mb-4">會員登入</h1>
            <div className="absolute top-1 left-0 w-full h-1 text-right">
              {/* 快速登入 DEMO 按鈕 */}
              <button
                type="button"
                onClick={handleQuickFill}
                className="mb-4 px-3 py-1 border border-brand-warm hover:bg-brand-warm transition-all duration-300 text-brand-warm hover:text-white rounded-full text-sm"
              >
                快速登入
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Email */}
            <div className="flex flex-col">
              <label className="px-4 py-2 flex items-center select-none">Email</label>
              <input
                type="text"
                name="email"
                value={userInput.email}
                onChange={handleFieldChange}
                onBlur={handleEmailBlur}
                className="w-full border border-primary rounded-full px-4 py-2 outline-none"
                placeholder="請輸入您的Email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* 密碼 */}
            <div className="flex flex-col">
              <label className="px-4 py-2 flex items-center select-none">密碼</label>
              <div className="flex border border-primary rounded-full overflow-hidden">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={userInput.password}
                  onChange={handleFieldChange}
                  onBlur={handlePasswordBlur}
                  className="w-full px-4 py-2 outline-none"
                  placeholder="請輸入您的密碼"
                  autoComplete="off"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  title={showPassword ? '隱藏密碼' : '顯示密碼'}
                  className="w-16 flex justify-center items-center border-l border-primary"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div className="w-full border-b-4 border-brand-warm/40 border-dotted"></div>

            {/* 一般登入按鈕 */}
            <button
              onClick={handleLogin}
              className="inline-block px-4 py-2 bg-primary hover:bg-brand-warm text-white rounded-full transition-colors duration-300"
            >
              登入
            </button>

            <div className="flex justify-between">
              <div className="text-center">
                還不是會員嗎？
                <Link href={'/member/register'} className="underline text-primary">
                  立即註冊
                </Link>
              </div>
              <div className="text-end">
                <Link href={'/member/forget-password'} className="underline text-primary">
                  忘記密碼？
                </Link>
              </div>
            </div>

            <div className="w-full border-b-4 border-brand-warm/40 border-dotted"></div>

            <GoogleLoginButton onClick={handleGoogleLogin} />
          </div>
        </div>
      </div>
    </section>
  )
}
