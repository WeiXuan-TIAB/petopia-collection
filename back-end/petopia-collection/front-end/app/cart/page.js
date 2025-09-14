'use client'

import '@/styles/globals.css'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaTrash } from 'react-icons/fa6'
import BottomBar from './_components/bottom_bar.jsx'
import PawStep from './_components/paw-step'
import CartProductItem from './_components/cart-product-item'
import CouponState from './_components/coupon_state'
import ProductItem from './_components/product_item'
import { useGetHotProducts } from '@/services/rest-client/use-product.js'
import { useCart } from '@/hooks/use-cart-state/cart-provider.js'
import Link from 'next/link.js'
import { useAuthGet } from '@/services/rest-client/use-user.js'
import Modal from './_components/modal.js'

export default function CartPage() {
  const [isOpen, setIsOpen] = useState(false)
  const { items, cart } = useCart()
  const { hotProducts } = useGetHotProducts()
  const { isAuth } = useAuthGet()

  // 計算小計
  const subtotal = cart.totalPrice

  const router = useRouter()
  const handleCheckout = () => {
    if (!isAuth) {
      setIsOpen(true)
      return
    }

    if (items.length === 0) {
      setIsOpen(true)
      return
    }
    router.push("/cart/pay-info")
  }

  return (
    <>
      <div className='w-full px-6 md:px-32 py-[60px] flex flex-col justify-center items-center gap-10'>
        {/* step*/}
        <div className="inline-flex flex-col justify-center items-center gap-1">
          <PawStep currentStep={1} />
        </div>

        {/* cart-list */}
        <div className='w-full max-w-[1280px] bg-white rounded-3xl flex flex-col py-2 md:py-6 px-2 md:px-6'>
          {/* th */}
          <div className='w-full flex justify-between text-fp-body md:text-fp-h5'>
            <div className='flex-1 text-center flex justify-start px-4 md:px-6 pt-4 md:pt-7 pb-5 font-fp-semibold'>商品資料</div>
            <div className='w-[200px] text-center hidden lg:flex justify-start px-4 lg:px-6 pt-7 pb-5 font-fp-semibold'>單價</div>
            <div className='w-[250px] text-center hidden lg:flex justify-center px-6 pt-7 pb-5 font-fp-semibold'>數量</div>
            <div className='w-[60px] md:w-[100px] text-center flex justify-center px-4 md:px-6 pt-5 md:pt-7 pb-5'><FaTrash /></div>
          </div>

          {/* list */}
          {items && items.length > 0 ? (
            <>
              {items.map((info) => (
                <CartProductItem key={info.id} productInfo={info} />
              ))}

              {/* 小計 */}
              <div className='w-full flex flex-row justify-end text-fp-h4 px-12 py-4'>
                <p>小計</p>
                <p className='ps-3 text-primary'>${(Number(subtotal) || 0).toLocaleString()}</p>
              </div>
            </>
          ) : (
            <>
              <Link href='/product' className="text-center text-button-info font-medium py-24">
                <p>購物車還空空的呢～ 快幫我挑點好吃好玩的放進去吧！ฅ^•ﻌ•^ฅ</p>
                <p>前往商城~ GOGO</p>
              </Link>
            </>
          )}

          <div className='flex flex-col justify-start px-4 md:px-6 pt-4 md:pt-7 pb-5 gap-3'>
            <p className='text-xl font-fp-semibold'>已享有優惠</p>
            <CouponState state={subtotal >= 1000 ? true : false} activity='全站滿千免運' />
            <CouponState state={subtotal >= 1000 ? true : false} activity='滿千折50' />
          </div>
        </div>
        {/* coupon*/}
        <div className='w-full max-w-[1280px] flex flex-col gap-4'>
          <p className='text-xl  font-fp-semibold'>優惠折抵</p>
          {subtotal >= 1000 && (
            <div className="w-full max-w-[1280px] bg-white rounded-3xl flex flex-col px-12 py-6">
              <div className="flex justify-between py-3">
                <p className=' text-xl'>滿額免運</p>
                <p className='ps-3 text-primary text-xl font-fp-semibold'>$0</p>
              </div>
              <div className="flex justify-between py-3">
                <p className=' text-xl'>滿千折50</p>
                <p className="ps-3 text-primary text-xl font-fp-semibold">- $50</p>
              </div>
            </div>
          )}

        </div>

        {/* recommend */}
        <div className='w-full max-w-[1280px] flex flex-col gap-4'>
          <p className='text-xl  font-fp-semibold'>加價購</p>
          <div className="w-full max-w-[1280px] bg-white rounded-3xl flex flex-col px-3 md:px-6 py-6">
            <div className="flex flex-col md:flex-row justify-between gap-6 ">
              {hotProducts?.map((product, index) => (
                <ProductItem key={index} product={product} />
              ))}
            </div>
          </div>

        </div>
        {/* remind */}
        <div className="w-full max-w-[1280px] bg-white rounded-3xl flex flex-col px-6 pt-7 pb-5">
          <div className="[&>p]:text-[14px] [&>p]:leading-[24px] [&>p]:font-normal md:[&>p]:text-[16px]">
            <p>購買須知</p>
            <p>．如訂單量較大或是有缺貨狀況，寄出時間將不一定，敬請見諒</p>
            <p>．若收到商品外箱有明顯破損，可以拒收並錄影存留，當下也請聯絡我們，謝謝</p>
            <p>．一般狀況超商取貨訂單將於下單後7~20天寄出(不包含例假日)</p>
            <p>．寄出後2~3天會到達指定門市</p>
            <p>．由於系統時間誤差，送貨狀態將會在到達門市日更新</p>
            <p>．1次逾期未取貨者，帳號將會被加入黑名單</p>
            <p>．如有要出國或是來台灣旅遊想帶商品的旅客，麻煩下單時詢問客服目前商品出貨的狀況</p>
            <p>．馬祖地區因近期海象不佳，船班不定期停航，請收到到貨簡訊後再至取件門市取件</p>
          </div>
        </div>
      </div >

      {/* Modal 區塊 */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        {items.length === 0 ? (
          <div className="flex flex-col gap-4 p-4">
            <p className="text-fp-body font-normal mb-4">購物車沒有商品</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => router.push(`/product`)}
                className="flex justify-center items-center px-6 py-2 rounded-full bg-primary text-background-secondary hover:bg-brand-warm/80 transition-colors duration-300"
              >
                前往商城
              </button>
            </div>
          </div>
        ) : !isAuth ? (
          <div className="flex flex-col gap-4 p-4">
            <p className="text-fp-body font-normal mb-4">登入後才能結帳</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsOpen(false)}
                className="flex justify-center items-center px-6 py-2 rounded-full bg-slate-400 text-background-secondary hover:bg-slate-600 transition-colors duration-300"
              >
                我再逛逛
              </button>
              <button
                onClick={() =>
                  router.push(`/member/login?redirect=/cart/pay-info`)
                }
                className="flex justify-center items-center px-6 py-2 rounded-full bg-primary text-background-secondary hover:bg-brand-warm/80 transition-colors duration-300"
              >
                前往登入
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
      <BottomBar
        onCheckout={handleCheckout}
        shippingFee={subtotal >= 1000 ? 0 : 60 }
        discount={subtotal >= 1000 ? 50 : 0}
        subtotal={subtotal}
      />
    </>
  )
}
