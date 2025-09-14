'use client'
import { useState } from "react"
import { useToggleProductLike, useProductState } from "@/services/rest-client/use-product"
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { toast, Bounce } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { IoPaw } from "react-icons/io5"

export default function BtnLike({ productId, productName, productData }) {
  // 永遠呼叫 hooks
  const { liked, toggleLike } = useToggleProductLike(productId, productData)
  const productCtx = useProductState()   // 如果沒有 Provider，會是 null

  const [loading, setLoading] = useState(false)

  const toastOptions = {
    position: "bottom-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    theme: "light",
    transition: Bounce,
  }

  const handleClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return
    setLoading(true)

    if (!productCtx) {
      // 沒有 Provider (例如登出) → 強制提示要登入
      toast.error("請先登入才能加入最愛", toastOptions)
      setLoading(false)
      return
    }

    const { success, prevLiked, needLogin } = await toggleLike()

    if (needLogin) {
      toast.error("請先登入才能加入最愛", toastOptions)
    } else if (success) {
      const message = (
        <div className="text-primary pe-4 flex justify-between items-center">
          {productName}{prevLiked ? '取消最愛!' : '加入最愛!'} <IoPaw />
        </div>
      )
      prevLiked ? toast.error(message, toastOptions) : toast.success(message, toastOptions)
    }

    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`group border-2 border-button-like w-9 h-9 rounded-full flex justify-center items-center transition-colors duration-300 
        ${liked ? "bg-red-500 text-white" : "bg-button-like text-white hover:bg-white hover:text-button-like"}
        ${loading ? "opacity-50 cursor-not-allowed" : ""}
      `}
    >
      {liked ? <FaHeart /> : <FaRegHeart />}
    </button>
  )
}
