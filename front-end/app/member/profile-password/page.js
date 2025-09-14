'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Breadcrumb from '@/app/_components/breadcrumb'
import { FaEyeSlash, FaEye } from 'react-icons/fa6'

import {
  useUserUpdatePassword,
  useAuthLogout,
  useAuthGet,
} from '@/services/rest-client/use-user'

export default function MemberPasswordPage() {
  const router = useRouter()
  const { isAuth } = useAuthGet()
  const { updatePassword } = useUserUpdatePassword()
  const { logout } = useAuthLogout()

  const [passwordInput, setPasswordInput] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  // === Regex ===
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,12}$/

  const handleFieldChange = (e) => {
    setPasswordInput({ ...passwordInput, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  // === onBlur 驗證 ===
  const handlePasswordBlur = (fieldName) => {
    if (passwordInput[fieldName] && !passwordRegex.test(passwordInput[fieldName])) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: '密碼格式不符 (需含字母、數字、符號，6-12碼)',
      }))
    }
  }

  // === 快速填入 DEMO 資料 ===
  const handleQuickFill = () => {
    setPasswordInput({
      currentPassword: 'P@ssw0rd',
      newPassword: 'P@ssw0rd123',
      confirmPassword: 'P@ssw0rd123',
    })
    setErrors({})
    // toast.info('已帶入 DEMO 測試資料')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!isAuth) {
      toast.error('錯誤 - 尚未登入會員')
      return
    }

    let newErrors = {}

    if (!passwordInput.currentPassword) {
      newErrors.currentPassword = '請輸入舊密碼'
    }

    if (!passwordInput.newPassword) {
      newErrors.newPassword = '請輸入新密碼'
    } else if (!passwordRegex.test(passwordInput.newPassword)) {
      newErrors.newPassword = '密碼格式不符 (需含字母、數字、符號，6-12碼)'
    }

    if (!passwordInput.confirmPassword) {
      newErrors.confirmPassword = '請再次輸入新密碼'
    } else if (passwordInput.newPassword !== passwordInput.confirmPassword) {
      newErrors.confirmPassword = '新密碼與確認密碼不一致'
    }

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    try {
      const res = await updatePassword({
        currentPassword: passwordInput.currentPassword,
        newPassword: passwordInput.newPassword,
      })

      const resData = await res.json()

      if (resData.status === 'success') {
        toast.success('密碼修改成功，將自動登出', {
          autoClose: 1500,
          onClose: async () => {
            await logout()
            router.push('/member/login')
          },
        })
      } else {
        toast.error(`修改失敗：${resData.message || '未知錯誤'}`)
      }
    } catch (err) {
      console.error(err)
      toast.error('修改密碼時發生錯誤')
    }
  }

  if (!isAuth) return <div className="text-center py-10">請先登入會員</div>

  return (
    <section className="w-full px-4 pb-10 lg:pb-20">
      <div className="container mx-auto md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
        <Breadcrumb />
        <div className="flex flex-col justify-center align-start bg-white/70 p-4 xl:p-8 rounded-4xl">
          <div className="relative">
            <h1 className="text-3xl text-center mb-4">修改密碼</h1>
            <div className="absolute top-1 left-0 w-full h-1 text-right">
              {/* 快速填入 DEMO 按鈕 */}
              <button
                type="button"
                onClick={handleQuickFill}
                className="mb-4 px-3 py-1 border border-brand-warm hover:bg-brand-warm transition-all duration-300 text-brand-warm hover:text-white rounded-full text-sm"
              >
                快速填入
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* 舊密碼 */}
            <div className="flex flex-col">
              <label className="px-4 py-2">舊密碼</label>
              <div className="flex border border-primary rounded-full overflow-hidden">
                <input
                  type={showPassword.currentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordInput.currentPassword}
                  onChange={handleFieldChange}
                  onBlur={() => handlePasswordBlur('currentPassword')}
                  className="w-full px-4 py-2 outline-none"
                  placeholder="請輸入舊密碼"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  className="w-16 h-12 flex justify-center items-center border-l border-primary"
                  onClick={() =>
                    setShowPassword({
                      ...showPassword,
                      currentPassword: !showPassword.currentPassword,
                    })
                  }
                >
                  {showPassword.currentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
              )}
            </div>

            {/* 新密碼 */}
            <div className="flex flex-col">
              <label className="px-4 py-2">新密碼</label>
              <div className="flex border border-primary rounded-full overflow-hidden">
                <input
                  type={showPassword.newPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordInput.newPassword}
                  onChange={handleFieldChange}
                  onBlur={() => handlePasswordBlur('newPassword')}
                  className="w-full px-4 py-2 outline-none"
                  placeholder="請輸入新密碼"
                />
                <button
                  type="button"
                  tabIndex={-1}
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
              <label className="px-4 py-2">確認新密碼</label>
              <div className="flex border border-primary rounded-full overflow-hidden">
                <input
                  type={showPassword.confirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={passwordInput.confirmPassword}
                  onChange={handleFieldChange}
                  onBlur={() => handlePasswordBlur('confirmPassword')}
                  className="w-full px-4 py-2 outline-none"
                  placeholder="請再次輸入新密碼"
                />
                <button
                  type="button"
                  tabIndex={-1}
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
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="w-full border-b-4 border-brand-warm/40 border-dotted"></div>
            <button
              type="submit"
              className="inline-block px-4 py-2 bg-primary hover:bg-brand-warm transition-colors duration-300 text-white rounded-full"
            >
              儲存修改
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
