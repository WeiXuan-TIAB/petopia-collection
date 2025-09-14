'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'
import Breadcrumb from '@/app/_components/breadcrumb'
import { apiURL } from '@/config'
import { FaEyeSlash, FaEye } from 'react-icons/fa6'

export default function ResetPasswordPage() {
  const router = useRouter()
  const sp = useSearchParams()
  const token = sp.get('token')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  })

  // 密碼格式 regex
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,12}$/

  // 驗證單一欄位
  const validateField = (field) => {
    const newErrors = { ...errors }

    if (field === 'newPassword') {
      if (!newPassword) {
        newErrors.newPassword = '請輸入新密碼'
      } else if (!passwordRegex.test(newPassword)) {
        newErrors.newPassword =
          '密碼需為6~12位，且必須包含英文、數字與符號各至少1個'
      } else {
        delete newErrors.newPassword
      }
    }

    if (field === 'confirmPassword') {
      if (!confirmPassword) {
        newErrors.confirmPassword = '請再次輸入新密碼'
      } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = '新密碼與確認密碼不一致'
      } else {
        delete newErrors.confirmPassword
      }
    }

    setErrors(newErrors)
  }

  // 驗證整份表單
  const validateForm = () => {
    validateField('newPassword')
    validateField('confirmPassword')
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // 最終檢查
    validateForm()
    if (Object.keys(errors).length > 0) return

    try {
      const res = await fetch(`${apiURL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      })
      const data = await res.json()

      if (data.status === 'success') {
        toast.success('密碼重設成功，請重新登入', {
          autoClose: 1500,
          onClose: () => router.push('/member/login'),
        })
      } else {
        toast.error(data.message || '重設失敗')
      }
    } catch (err) {
      console.error(err)
      toast.error('伺服器錯誤，請稍後再試')
    }
  }

  return (
    <section className="w-full px-4 pb-10 lg:pb-20">
      <div className="container mx-auto md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
        <Breadcrumb />
        <div className="flex flex-col justify-center bg-white/70 p-4 xl:p-8 rounded-4xl">
          <h1 className="text-3xl text-center mb-4">重設密碼</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            {/* 新密碼 */}
            <div className="flex flex-col">
              <div
                className={`flex border rounded-full overflow-hidden ${
                  errors.newPassword ? 'border-red-500' : 'border-primary'
                }`}
              >
                <input
                  type={showPassword.newPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={() => validateField('newPassword')}
                  placeholder="6-12位數字、字母和符號組合"
                  autoComplete="new-password"
                  className="w-full px-4 py-2 outline-none"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  title={showPassword.newPassword ? '隱藏密碼' : '顯示密碼'}
                  className="w-16 h-12 flex justify-center items-center border-l border-primary"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      newPassword: !showPassword.newPassword,
                    })
                  }
                >
                  {showPassword.newPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
              )}
            </div>

            {/* 確認新密碼 */}
            <div className="flex flex-col">
              <div
                className={`flex border rounded-full overflow-hidden ${
                  errors.confirmPassword ? 'border-red-500' : 'border-primary'
                }`}
              >
                <input
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => validateField('confirmPassword')}
                  placeholder="再次輸入新密碼"
                  autoComplete="new-password"
                  className="w-full px-4 py-2 outline-none"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  title={showPassword.confirmPassword ? '隱藏密碼' : '顯示密碼'}
                  className="w-16 h-12 flex justify-center items-center border-l border-primary"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      confirmPassword: !showPassword.confirmPassword,
                    })
                  }
                >
                  {showPassword.confirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded-full"
            >
              儲存新密碼
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
