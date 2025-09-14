'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cropper from 'react-easy-crop'
import { mutate as globalMutate } from 'swr'
import Image from 'next/image'
import { apiURL, serverURL } from '@/config'
import Breadcrumb from '@/app/_components/breadcrumb'

import {
  useUserProfile,
  useUserUpdateProfile,
} from '@/services/rest-client/use-user'
import getCroppedImg from '@/utils/cropImage'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/_components/ui/select'

// const apiURL = process.env.NEXT_PUBLIC_API_URL

export default function MemberProfilePage() {
  const router = useRouter()
  const { member, isLoading, mutate } = useUserProfile()
  const { updateProfile } = useUserUpdateProfile()

  const fileInputRef = useRef(null)
  const [isOpeningDialog, setIsOpeningDialog] = useState(false)
  const safetyTimerRef = useRef(null)

  // 基本資料
  const [profileInput, setProfileInput] = useState({
    email: '',
    name: '',
    nickname: '',
    gender: undefined,
    mobile: '',
    birthday: '',
  })

  // 頭像裁切相關
  const [imageSrc, setImageSrc] = useState(null)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [previewUrl, setPreviewUrl] = useState('/default-avatar.png')

  useEffect(() => {
    if (member) {
      setProfileInput({
        email: member.email || '',
        name: member.name || '',
        nickname: member.nickname || '',
        gender: member.gender || undefined,
        mobile: member.mobile || '',
        birthday: member.birthday || '',
      })

      const avatarUrl = member.avatar
        ? member.avatar.startsWith('http')
          ? `${member.avatar}&v=${Date.now()}`
          : `${serverURL}${member.avatar}?v=${Date.now()}`
        : '/default-avatar.png'

      setPreviewUrl(avatarUrl)
    }
  }, [member])

  const handleFieldChange = (e) => {
    setProfileInput({ ...profileInput, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await updateProfile(profileInput)
    const resData = await res.json()

    if (resData.status === 'success') {
      toast.success('會員資料更新成功', {
        autoClose: 1000,
        onClose: () => {
          mutate()
          router.push('/member/profile')
        },
      })
    } else {
      toast.error(`更新失敗：${resData.message || '未知錯誤'}`)
    }
  }

  // 讀取本地檔案轉 base64 供 cropper 預覽
  const readFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
  }

  // 選擇圖片
  const onFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      const imageDataUrl = await readFile(file)
      setImageSrc(imageDataUrl)
    }
  }

  // 裁切完成
  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  // 確認裁切並上傳
  const handleCropConfirm = async () => {
    if (!apiURL) {
      toast.error('環境變數 NEXT_PUBLIC_API_URL 未設定')
      return
    }

    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels)
      const formData = new FormData()
      formData.append('avatar', croppedBlob, 'avatar.png')

      const res = await fetch(`${apiURL}/members/me/avatar`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!res.ok) {
        const text = await res.text()
        console.error('上傳失敗：', text)
        toast.error('頭像上傳失敗')
        return
      }

      const data = await res.json()
      if (data.status === 'success') {
        const newAvatarUrl = data.avatar.startsWith('http')
          ? data.avatar
          : `${serverURL}${data.avatar}`

        setPreviewUrl(`${newAvatarUrl}?v=${Date.now()}`)
        setImageSrc(null)

        // 刷新本頁
        mutate()

        // 🔹 強制刷新 Navbar
        globalMutate(`${apiURL}/auth/check`, undefined, { revalidate: true })
      } else {
        toast.error(data.message || '頭像更新失敗')
      }
    } catch (err) {
      console.error(err)
      toast.error('裁切或上傳時發生錯誤')
    }
  }

  // 1) 點按自訂按鈕 → 顯示 Loading → 觸發 input.click()
  const handleOpenFileDialog = () => {
    setIsOpeningDialog(true)

    // 安全保險：避免某些極端情況 loading 卡住
    safetyTimerRef.current = setTimeout(() => {
      setIsOpeningDialog(false)
    }, 10000)

    fileInputRef.current?.click()
  }

  // 2) 檔案有選到 → 交給你原本的 onFileChange，並關閉 Loading
  const handleFileChange = async (e) => {
    clearTimeout(safetyTimerRef.current)
    setIsOpeningDialog(false)
    await onFileChange(e) // 這是你程式裡既有的函式
  }

  // 3) 使用者關掉對話框（取消）→ 視窗會重新取得焦點，這時關閉 Loading
  useEffect(() => {
    const handleFocus = () => {
      if (isOpeningDialog) {
        // 加一點點延遲，確保不會和 onChange 打架
        setTimeout(() => {
          setIsOpeningDialog(false)
          clearTimeout(safetyTimerRef.current)
        }, 50)
      }
    }

    // 某些瀏覽器（或多螢幕）不一定觸發 focus，補一個 visibilitychange
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && isOpeningDialog) {
        setTimeout(() => {
          setIsOpeningDialog(false)
          clearTimeout(safetyTimerRef.current)
        }, 50)
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibility)
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibility)
      clearTimeout(safetyTimerRef.current)
    }
  }, [isOpeningDialog])

  if (isLoading) return <div className="text-center py-10">載入中...</div>
  if (!member) return <div className="text-center py-10">請先登入會員</div>

  return (
    <section className="w-full px-4 pb-10 lg:pb-20">
      <div className="container mx-auto md:w-1/2 lg:w-1/2 xl:w-1/3 2xl:w-1/4">
        <Breadcrumb />
        <div className="flex flex-col justify-center align-start bg-white/70 p-4 xl:p-8 rounded-4xl">
          <h1 className="text-3xl text-center mb-4">修改會員資料</h1>

          {/* 頭像編輯區 */}
          <div className="flex flex-col items-center mb-6">
            <Image
              width={160}
              height={160}
              src={previewUrl}
              alt="avatar preview"
              className="w-40 h-40 rounded-full border mb-2"
            />
            {/* 自訂按鈕 */}
            <button
              type="button"
              onClick={handleOpenFileDialog}
              className="px-3 py-2 rounded-full bg-primary text-white disabled:opacity-60"
              disabled={isOpeningDialog}
            >
              {isOpeningDialog ? '正在開啟檔案視窗…' : '選擇頭像檔案'}
            </button>

            {/* 隱藏的 input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* 額外的小提示（可選） */}
            {isOpeningDialog && (
              <div className="mt-2 text-sm text-gray-500">
                第一次可能較久，請稍候…
              </div>
            )}
          </div>

          {imageSrc && (
            <>
              <div className="relative w-full h-64 bg-black mt-4 mb-4">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              </div>
              <button
                type="button"
                onClick={handleCropConfirm}
                className="mt-2 mb-4 px-4 py-2 bg-primary text-white rounded-full"
              >
                確認裁切並上傳
              </button>
            </>
          )}

          {/* 基本資料表單 */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col">
              <label className="px-4 py-2 flex items-center select-none">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={profileInput.email}
                readOnly
                className="basis-full px-4 py-2 outline-none bg-gray-100 text-gray-500 cursor-not-allowed rounded-full"
              />
            </div>

            <div className="flex flex-col">
              <label className="px-4 py-2 flex items-center select-none">
                姓名
              </label>
              <input
                type="text"
                name="name"
                value={profileInput.name}
                onChange={handleFieldChange}
                className="w-full border border-primary rounded-full overflow-hidden px-4 py-2 outline-none"
                placeholder="請輸入姓名"
              />
            </div>

            <div className="flex flex-col">
              <label className="px-4 py-2 flex items-center select-none">
                暱稱
              </label>
              <input
                type="text"
                name="nickname"
                value={profileInput.nickname}
                onChange={handleFieldChange}
                className="w-full border border-primary rounded-full overflow-hidden px-4 py-2 outline-none"
                placeholder="請輸入暱稱"
              />
            </div>

            <div className="flex flex-col">
              <label className="px-4 py-2 flex items-center select-none">
                性別
              </label>
              <Select
                key={profileInput.gender || 'empty'}
                value={profileInput.gender}
                onValueChange={(value) =>
                  setProfileInput({ ...profileInput, gender: value })
                }
              >
                <SelectTrigger className="w-full h-full border border-primary rounded-full overflow-hidden px-4 py-2 outline-none text-base">
                  <SelectValue placeholder="請選擇性別" />
                </SelectTrigger>
                <SelectContent className="bg-white text-base">
                  <SelectItem value="male" className="hover:bg-primary/10">
                    男
                  </SelectItem>
                  <SelectItem value="female" className="hover:bg-primary/10">
                    女
                  </SelectItem>
                  <SelectItem value="other" className="hover:bg-primary/10">
                    其它
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col">
              <label className="px-4 py-2 flex items-center select-none">
                手機
              </label>
              <input
                type="text"
                name="mobile"
                value={profileInput.mobile}
                onChange={handleFieldChange}
                className="w-full border border-primary rounded-full overflow-hidden px-4 py-2 outline-none"
                placeholder="請輸入手機號碼"
              />
            </div>

            <div className="flex flex-col">
              <label className="px-4 py-2 flex items-center select-none">
                生日
              </label>
              <input
                type="date"
                name="birthday"
                value={profileInput.birthday}
                onChange={handleFieldChange}
                className="w-full border border-primary rounded-full overflow-hidden px-4 py-2 outline-none"
              />
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
