'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useUserRegister } from '@/services/rest-client/use-user'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'react-toastify'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useUserRegister()
  const { isAuth } = useAuth()

  const [userInput, setUserInput] = useState({
    email: '',
    password: '',
    name: '',
    nickname: '',
    gender: '',
    mobile: '',
    birthday: '',
  })

  const [errors, setErrors] = useState({})

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{6,12}$/
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const mobileRegex = /^09\d{8}$/ // 台灣手機格式 09 開頭 + 8 碼

  const today = new Date().toISOString().split('T')[0] // 取得今天 yyyy-mm-dd

  const handleFieldChange = (e) => {
    const { name, value } = e.target
    setUserInput({ ...userInput, [name]: value })
    setErrors({ ...errors, [name]: '' }) // 清除對應欄位錯誤
  }

  // === 密碼檢查 ===
  const handlePasswordBlur = () => {
    if (userInput.password && !passwordRegex.test(userInput.password)) {
      setErrors({ ...errors, password: '密碼格式不符' })
    } else {
      setErrors({ ...errors, password: '' })
    }
  }

  // === Email 檢查 ===
  const handleEmailBlur = () => {
    if (userInput.email && !emailRegex.test(userInput.email)) {
      setErrors({ ...errors, email: 'Email 格式不正確' })
    } else {
      setErrors({ ...errors, email: '' })
    }
  }

  // === 手機號碼檢查 ===
  const handleMobileBlur = () => {
    if (userInput.mobile && !mobileRegex.test(userInput.mobile)) {
      setErrors({ ...errors, mobile: '手機號碼格式不正確 (需為09開頭共10碼)' })
    } else {
      setErrors({ ...errors, mobile: '' })
    }
  }

  // === 生日檢查 ===
  const handleBirthdayBlur = () => {
    if (userInput.birthday && userInput.birthday > today) {
      setErrors({ ...errors, birthday: '生日不能晚於今天' })
    } else {
      setErrors({ ...errors, birthday: '' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isAuth) {
      toast.error('錯誤 - 會員已登入')
      return
    }

    // === 必填檢查 ===
    let newErrors = {}
    Object.entries(userInput).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = '此欄位為必填'
      }
    })

    // === 格式檢查 ===
    if (!newErrors.email && !emailRegex.test(userInput.email)) {
      newErrors.email = 'Email 格式不正確'
    }
    if (!newErrors.password && !passwordRegex.test(userInput.password)) {
      newErrors.password = '密碼格式不符'
    }
    if (!newErrors.mobile && !mobileRegex.test(userInput.mobile)) {
      newErrors.mobile = '手機號碼格式不正確 (需為09開頭共10碼)'
    }
    if (!newErrors.birthday && userInput.birthday > today) {
      newErrors.birthday = '生日不能晚於今天'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      return // 有錯誤就中斷送出
    }

    // === 呼叫 API ===
    const res = await register(userInput)
    const resData = await res.json()

    if (resData.status === 'success') {
      router.push('/member/login')
      toast.success('註冊成功，請登入！')
    } else {
      toast.error(`錯誤 - 註冊失敗: ${resData.message}`)
    }
  }

  // === 快速填入 DEMO 資料 ===
  const handleQuickFill = () => {
    setUserInput({
      email: 'petopia.demo@petopia.com',
      password: 'P@ssw0rd',
      name: '沛托邦',
      nickname: 'Petopia Demo',
      gender: 'male',
      mobile: '0968777231',
      birthday: '1990-01-01',
    })
    setErrors({})
  }

  return (
    <section className="w-full px-4 pb-10 lg:pb-20">
      <div className="container mx-auto md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
        <div className="flex flex-col justify-center align-start mt-10 bg-white/70 p-4 xl:p-8 rounded-4xl">
          <div className="relative">
            <h1 className="text-3xl text-center mb-4">會員註冊</h1>
            <div className="absolute top-1 left-0 w-full h-1 text-right">
              {/* 快速登入 DEMO 按鈕 */}
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
            {/* Email */}
            <div className="flex flex-col">
              <label className="px-4 py-2">Email</label>
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
              <label className="px-4 py-2">密碼</label>
              <input
                type="password"
                name="password"
                value={userInput.password}
                onChange={handleFieldChange}
                onBlur={handlePasswordBlur}
                className="w-full border border-primary rounded-full px-4 py-2 outline-none"
                placeholder="6-12位數字、字母和符號組合"
                autoComplete="new-password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* 姓名 */}
            <div className="flex flex-col">
              <label className="px-4 py-2">姓名</label>
              <input
                type="text"
                name="name"
                value={userInput.name}
                onChange={handleFieldChange}
                className="w-full border border-primary rounded-full px-4 py-2 outline-none"
                placeholder="請輸入您的姓名"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* 暱稱 */}
            <div className="flex flex-col">
              <label className="px-4 py-2">暱稱</label>
              <input
                type="text"
                name="nickname"
                value={userInput.nickname}
                onChange={handleFieldChange}
                className="w-full border border-primary rounded-full px-4 py-2 outline-none"
                placeholder="請輸入您的暱稱"
              />
              {errors.nickname && (
                <p className="text-red-500 text-sm mt-1">{errors.nickname}</p>
              )}
            </div>

            {/* 性別 */}
            <div className="flex flex-col">
              <label className="px-4 py-2">性別</label>
              <Select
                value={userInput.gender}
                onValueChange={(value) => {
                  setUserInput({ ...userInput, gender: value })
                  setErrors({ ...errors, gender: '' })
                }}
              >
                <SelectTrigger className="w-full bg-white border border-primary rounded-full px-4 py-2 outline-none text-base h-11">
                  <SelectValue placeholder="請選擇性別" />
                </SelectTrigger>
                <SelectContent className="w-full bg-white cursor-pointer">
                  <SelectItem value="male">男</SelectItem>
                  <SelectItem value="female">女</SelectItem>
                  <SelectItem value="other">其它</SelectItem>
                </SelectContent>
              </Select>
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>

            {/* 手機 */}
            <div className="flex flex-col">
              <label className="px-4 py-2">手機</label>
              <input
                type="text"
                name="mobile"
                value={userInput.mobile}
                onChange={handleFieldChange}
                onBlur={handleMobileBlur}
                className="w-full border border-primary rounded-full px-4 py-2 outline-none"
                placeholder="請輸入您的手機 (09開頭，共10碼)"
              />
              {errors.mobile && (
                <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* 生日 */}
            <div className="flex flex-col">
              <label className="px-4 py-2">生日</label>
              <input
                type="date"
                name="birthday"
                value={userInput.birthday}
                onChange={handleFieldChange}
                onBlur={handleBirthdayBlur}
                max={today} // 禁止選擇未來日期
                className="w-full border border-primary rounded-full px-4 py-2 outline-none"
              />
              {errors.birthday && (
                <p className="text-red-500 text-sm mt-1">{errors.birthday}</p>
              )}
            </div>

            <div className="w-full border-b-4 border-brand-warm/40 border-dotted"></div>
            <button
              type="submit"
              className="inline-block px-4 py-2 bg-primary hover:bg-brand-warm transition-colors duration-300 text-white rounded-full"
            >
              註冊
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}
