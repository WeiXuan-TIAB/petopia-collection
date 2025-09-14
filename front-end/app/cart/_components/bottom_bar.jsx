'use client'

import React, { useState } from 'react'
import Modal from './modal'
import { useCart } from '@/hooks/use-cart-state/cart-provider'

export default function BottomBar({ onCheckout, shippingFee = 60, discount = 0, subtotal = 0 }) {
  const [isOpen, setIsOpen] = useState(false)
  const { cart, items } = useCart()
  const finalPrice = subtotal + shippingFee - discount

  return (
    <>
      {/* 底部結帳區塊 */}
      <div className="fixed bottom-0 z-40 flex flex-col md:flex-row justify-center md:justify-end items-end md:items-center px-6 md:px-12 lg:px-8 bg-background-primary/50 backdrop-blur w-full left-0 py-4 gap-2 md:gap-6 shadow-[0px_0_25px_rgba(0,0,0,0.2)] shadow-primary/20 h-auto">
        <div className="flex flex-col">
          <div className="flex items-end justify-end">
            <span className="text-xl">合計</span>
            <span className="text-border-primary text-xl px-2">
              $ {finalPrice ? finalPrice.toLocaleString() : 0}
            </span>
            {cart.totalPrice > 1000 && (
              <span className="text-base">(免運)</span>
            )}
          </div>

          <div className="flex items-end text-text-primary/70 text-base justify-end gap-2">
            <div>
              <span>總計:</span>
              <span>
                {`$ ${(cart.totalPrice ?? 0).toLocaleString()}`}
              </span>
            </div>

            {cart.totalPrice > 1000 ? (
              <div>
                <span>折抵:</span>
                <span>-${discount}</span>
              </div>
            ) : (
              <div>
                <span>運費:</span>
                <span>${shippingFee}</span>
              </div>
            )}

            <button
              className="text-xl text-button-info"
              onClick={() => setIsOpen(true)}
            >
              明細
            </button>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="flex justify-end align-center px-6 py-2 rounded-5xl bg-primary text-background-secondary hover:bg-brand-warm/80 transition-colors duration-300"
        >
          結帳
        </button>
      </div>

      {/* Modal 區塊 */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex flex-col gap-2 md:gap-4 p-0 md:p-4">
          <p className="text-fp-small md:text-fp-body font-normal mb-4">
            {`本次結帳 ${items.length} 項商品 共 ${cart.totalItems} 件`}
          </p>

          <div className="flex justify-between">
            <p className="text-fp-body mb-4">商品總價</p>
            <p className="text-fp-body mb-4">
              $ {cart.totalPrice ? cart.totalPrice : 0}
            </p>
          </div>

          <div className="flex justify-between border-b-2">
            <p className="text-fp-body mb-4">
              {cart.totalPrice > 1000 ? '優惠折扣' : '運費'}
            </p>
            <p className="text-fp-body mb-4">
              {cart.totalPrice > 1000 ? `- $${discount}` : `$${shippingFee}`}
            </p>
          </div>

          <div className="flex justify-between">
            <p className="text-fp-body mb-4">結帳金額</p>
            <p className="text-fp-body mb-4">
              $ {finalPrice.toLocaleString()}
            </p>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="flex justify-center items-center px-6 py-2 rounded-full bg-primary text-background-secondary hover:bg-brand-warm/80 transition-colors duration-300"
          >
            確認
          </button>
        </div>
      </Modal>
    </>
  )
}
