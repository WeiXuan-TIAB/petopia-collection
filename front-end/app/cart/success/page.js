'use client'

import { useRef } from 'react'
import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/hooks/use-cart-state/cart-provider'
import { isDev } from '@/config'
import { generateOrderNumber } from '@/utils/orderNumber'
import PawStep from '../_components/paw-step'
import CatSvg from '../_components/cat-svg'

export default function SuccessPage() {
  const [orderData, setOrderData] = useState(null)
  const [orderNo, setOrderNo] = useState("");
  const { clearCart, clearCartViewOnly } = useCart()
  const searchParams = useSearchParams()
  const clearedRef = useRef(false)

  useEffect(() => {
    const newOrderNo = generateOrderNumber();
    setOrderNo(newOrderNo);
  }, [])

   // 進頁面 → 只清 Context，localStorage 保留
  useEffect(() => {
    if (clearedRef.current) return
    clearedRef.current = true
    clearCartViewOnly()
  }, [clearCartViewOnly])


  if (isDev) console.log('RtnCode', searchParams?.get('RtnCode'))

  const router = useRouter()
  useEffect(() => {
    const saved = localStorage.getItem("orderData")
    if (saved) {
      setOrderData(JSON.parse(saved))
    }
  }, [])
  useEffect(()=>{

  },[])
  const handleGoShopping = () => {
    localStorage.removeItem("cart")
    localStorage.removeItem("store711")
    localStorage.removeItem("orderData")
    clearCart()
    router.push('/')
  }

  const handleCheckOrders = () => {
    localStorage.removeItem("cart")
    localStorage.removeItem("store711")
    localStorage.removeItem("orderData")
    clearCart()
    router.push('/member')
  }


  return (
    <>
      <div className='w-full px-6 md:px-32 py-10 md:py-[60px] flex flex-col justify-center items-center gap-10'>
        {/* step*/}
        <div className="inline-flex flex-col justify-center items-center pb-10">
          <PawStep currentStep={3} />
        </div>
        {/* cat */}
        <div className='flex flex-col items-center gap-0 pb-4'>
          <CatSvg classname='w-[200px] md:w-[300px] lg:w-[380px]' />
          <div className="py-8 inline-flex flex-col justify-start items-center gap-2.5">
            <div className="text-center justify-start text-red-500 text-2xl md:text-4xl font-normal  leading-10">訂單成立!</div>
            <div className="text-center justify-start text-stone-700 text-lg md:text-2xl font-normal leading-normal">感謝您的購買，我們已收到您的訂單</div>
          </div>
          <div className="text-center text-stone-700 text-md md:text-2xl font-normal leading-normal">訂單編號 : {orderNo}</div>
        </div>

        {/* order-info */}
        {orderData?.payment === 'ecpay' ?
          <div className='w-full max-w-[1280px] flex flex-col gap-4 py-4'>
            <p className='text-base md:text-xl  font-fp-semibold'>訂單資訊</p>
            <div className="w-full max-w-[1280px] bg-white rounded-3xl flex flex-col px-4 md:px-20 py-6 md:py-16 gap-4">
              <div className="flex flex-col gap-2 ">
                <h5 className='text-base md:text-fp-h5'>配送方式</h5>
                <h5 className='ps-6 text-base md:text-fp-h6 text-gray-500'>{orderData?.deliver || '宅配 - 新竹貨運'}</h5>
              </div>
              <div className="flex flex-col gap-2 ">
                <h5 className='text-base md:text-fp-h5'>配送地址 / 門市</h5>
                <h5 className='ps-6 text-base md:text-fp-h6 text-gray-500'>{orderData?.address || '幸福門市'}</h5>
              </div>
              <div className="flex flex-col gap-2 ">
                <h5 className='text-base md:text-fp-h5'>付款資訊</h5>
                <div className='flex flex-col'>
                  <h5 className='px-6 text-base md:text-fp-h6 text-gray-500'>金額 : {searchParams?.get('TradeAmt')}</h5>
                  <div className='flex'>
                    <h5 className='px-6 text-base md:text-fp-h6 text-gray-500'>{searchParams?.get('PaymentType')}</h5>
                    {orderData?.payment !== '貨到付款' && <h5 className='py-1 px-4 text-sm rounded-2xl text-green-600 border-2 border-green-600'>已付款</h5>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 ">
                <h5 className='text-base md:text-fp-h5'>預計到貨</h5>
                <h5 className='ps-6 text-base md:text-fp-h6 text-gray-500'>約3-5個工作天</h5>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className='text-base md:text-fp-h5'>收件人資訊</h5>
                <div>
                  <h5 className='ps-6 text-base md:text-fp-h6 text-gray-500'>{orderData?.recipientName || '喵喵喵'}</h5>
                  <h5 className='ps-6 text-base md:text-fp-h6 text-gray-500'>{orderData?.recipientPhone || '0911-123-123'}</h5>
                </div>
              </div>
            </div>
          </div>

          : <div className='w-full max-w-[1280px] flex flex-col gap-4 py-4'>
            <p className='text-xl  font-fp-semibold'>訂單資訊</p>
            <div className="w-full max-w-[1280px] bg-white rounded-3xl flex flex-col px-4 md:px-20 py-6 md:py-16 gap-4">
              <div className="flex flex-col gap-2 ">
                <h5 className='text-base md:text-fp-h5'>配送方式</h5>
                <h5 className='ps-6 text-base md:text-fp-h6 text-gray-500'>{orderData?.deliver || '宅配 - 新竹貨運'}</h5>
              </div>
              <div className="flex flex-col gap-2 ">
                <h5 className='text-base md:text-fp-h5'>配送地址 / 門市</h5>
                <h5 className='ps-6 text-base md:text-fp-h6 text-gray-500'>{orderData?.address || '幸福門市'}</h5>
              </div>
              <div className="flex flex-col gap-2 ">
                <h5 className='text-base md:text-fp-h5'>付款資訊</h5>
                <div className='flex flex-col'>
                  <h5 className='px-6 text-base md:text-fp-h6 text-gray-500'>金額 : {orderData?.totalAmount || '0000'}</h5>
                  <div className='flex'>
                    <h5 className='px-6 text-base md:text-fp-h6 text-gray-500'>{orderData?.payment || 'Line Pay'}</h5>
                    {orderData?.payment !== '貨到付款' && <h5 className='py-1 px-4 text-sm rounded-2xl text-green-600 border-2 border-green-600'>已付款</h5>}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 ">
                <h5 className='text-base md:text-fp-h5'>預計到貨</h5>
                <h5 className='ps-6 text-fp-h6 text-gray-500'>約3-5個工作天</h5>
              </div>
              <div className="flex flex-col gap-2">
                <h5 className='text-base md:text-fp-h5'>收件人資訊</h5>
                <div>
                  <h5 className='ps-6 text-fp-h6 text-gray-500'>{orderData?.recipientName || '喵喵喵'}</h5>
                  <h5 className='ps-6 text-fp-h6 text-gray-500'>{orderData?.recipientPhone || '0911-123-123'}</h5>
                </div>
              </div>
            </div>

          </div>
        }

        <div className='flex flex-col md:flex-row gap-6'>
          <button
            onClick={() => { handleCheckOrders() }}
            className='w-[280px] md:w-[400px] py-2 text-xl text-center border-[1px] border-primary bg-white hover:bg-primary text-primary hover:text-white rounded-full'>查看訂單詳情</button>
          <button
            onClick={() => { handleGoShopping() }}
            className='w-[280px] md:w-[400px] py-2 text-xl text-center  text-white bg-brand-warm hover:bg-primary rounded-full'>到處逛逛</button>

        </div>
        <div className="inline-flex flex-col justify-start items-center">
          <div className="text-center text-text-primary text-sm md:text-base font-normal leading-normal">訂單確認信已發送至您的電子信箱，請留意查收</div>
          <div className="text-center text-text-primary text-sm md:text-base font-fp-semibold leading-normal">如有任何問題，請聯繫客服：0800-123-456</div>
        </div>
      </div>
    </>
  )
}
