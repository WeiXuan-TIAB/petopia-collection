'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Breadcrumb from '@/app/_components/breadcrumb'
import { apiURL } from '@/config'

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState({})
  const [isSending, setIsSending] = useState(false) // 是否寄信中
  const [success, setSuccess] = useState(false)     // 是否已成功寄信
  const [cooldown, setCooldown] = useState(0)       // 倒數秒數

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // 倒數計時
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [cooldown])

  const handleEmailBlur = () => {
    if (email && !emailRegex.test(email)) {
      setErrors({ email: 'Email 格式不正確' })
    } else {
      setErrors({})
    }
  }

  const handleQuickFill = () => {
    setEmail('tw.james.peng@gmail.com')
    setErrors({})
    // toast.info('已帶入 DEMO 測試資料')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email) {
      toast.error('請輸入 Email')
      return
    }

    if (!emailRegex.test(email)) {
      setErrors({ email: 'Email 格式不正確' })
      return
    }

    try {
      setIsSending(true)
      setSuccess(false)

      const res = await fetch(`${apiURL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (data.status === 'success') {
        toast.success('重設密碼連結已寄出 📧')
        setSuccess(true)
        setCooldown(60) // 1 分鐘冷卻
      } else {
        toast.error(data.message || '寄送失敗')
      }
    } catch (err) {
      console.error(err)
      toast.error('伺服器錯誤，請稍後再試')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="w-full px-4 pb-10 lg:pb-20">
      <div className="container mx-auto md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
        <Breadcrumb />
        <div className="flex flex-col justify-center bg-white/70 p-4 xl:p-8 rounded-4xl">
          <div className="relative">
            <h1 className="text-3xl text-center mb-4">忘記密碼</h1>
            <div className="absolute top-1 left-0 w-full h-1 text-right">
              {/* 快速填入 DEMO 按鈕 */}
              <button
                type="button"
                onClick={handleQuickFill}
                className="mb-4 px-3 py-1 border border-brand-warm hover:bg-brand-warm 
                  transition-all duration-300 text-brand-warm hover:text-white rounded-full text-sm"
              >
                快速填入
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              placeholder="請輸入您的 Email"
              className="border px-4 py-2 rounded-full"
              disabled={isSending || cooldown > 0}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}

            {/* 系統寄信中提示 */}
            {isSending && (
              <p className="text-blue-600 text-sm text-center">
                系統寄信中，請稍候…
              </p>
            )}

            {/* 寄送成功提示 */}
            {success && (
              <div className="text-center space-y-1">
                <p className="text-green-600 text-sm">
                  重設密碼信已寄出，請至 {email} 收信
                </p>
                <p className="text-gray-500 text-xs">
                  若未收到郵件，請檢查垃圾郵件匣
                </p>
              </div>
            )}

            <button
              type="submit"
              className={`px-4 py-2 rounded-full text-white transition ${
                isSending || cooldown > 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-brand-warm'
              }`}
              disabled={isSending || cooldown > 0}
            >
              {cooldown > 0
                ? `請稍候 ${Math.floor(cooldown / 60)}:${String(
                    cooldown % 60
                  ).padStart(2, '0')} 後可重新發送`
                : isSending
                ? '寄送中...'
                : success
                ? '重新發送重設密碼信'
                : '發送重設密碼信'}
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
