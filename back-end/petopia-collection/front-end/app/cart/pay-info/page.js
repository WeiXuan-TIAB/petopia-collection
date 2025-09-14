'use client'

import '@/styles/globals.css'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image.js'
import BottomBar from '../_components/bottom_bar.jsx'
import PawStep from '../_components/paw-step'
import RadioGroup from '@/app/_components/ui/radio-group.jsx'
import CheckboxRadio from '@/app/_components/ui/checkbox-radio.jsx'
import Modal from '../_components/modal.js'
import Input from '@/app/_components/input.jsx'
import { FaPhone, FaHouseChimney, FaCircleUser, FaEnvelope } from "react-icons/fa6";
import { useShip711StoreOpener } from '@/app/ship/_hooks/use-ship-711-store/index.js'
import { useCart } from '@/hooks/use-cart-state/cart-provider.js'
import { useUserProfile } from '@/services/rest-client/use-user'
import { nextUrl } from '@/config/index.js'
import { toast } from 'react-toastify'
import { apiURL } from '@/config/index.js'

const DELIVER_MAP = {
  "HCT": "宅配 - 新竹貨運",
  "711-pay": "7-11 取貨不付款",
  "711-noPay": "7-11 取貨付款"
};

const SHIPPING_FEE_MAP = {
  "HCT": 100,
  "711-pay": 60,
  "711-noPay": 60
};

const PAYMENT_MAP = {
  "ecPay": { name: "信用卡 - 綠界支付", url: "/ecpay" },
  "line-pay": { name: "Line Pay" },
  "711-noPay": { name: "貨到付款", url: "/cart/success" }
};

export default function PayInfoPage() {
  const router = useRouter()
  const [selectedDeliver, setSelectedDeliver] = useState("")
  const [selectedPayment, setSelectedPayment] = useState("")
  const [modalConfig, setModalConfig] = useState({ isOpen: false, message: "", orderSummary: null, confirmAction: null });
  const { member } = useUserProfile()
  const { cart} = useCart()
  const { store711, openWindow } = useShip711StoreOpener(
    `${nextUrl}/ship/api`,
    { autoCloseMins: 3 } // 沒完成選擇會自動關閉
  )

  useEffect(() => {
    if (member) {
      setOrderInfo({
        name: member?.name || "",
        email: member?.email || "",
        phone: member?.mobile || "",
        address: member?.address || ""
      })
    }
  }, [member])

  // ── 購買人 / 收件人（受控）與「同訂購人」checkbox 狀態 ──
  const [orderInfo, setOrderInfo] = useState({
    name: "", email: "", phone: "", address: "",
    invoiceType: "customer",   // 預設會員載具
    invoiceValue: ""           // 手機載具號碼 或 統編
  });
  const [recipientInfo, setRecipientInfo] = useState({
    name: "", email: "", phone: "", address: ""
  });
  // CheckboxRadio 是字串：'' 或 'same'
  const [recipientCheck, setRecipientCheck] = useState("");

  const subtotal = cart.totalPrice

  // 建立 form 表單
  const createEcpayForm = (params, action) => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = action
    for (const key in params) {
      const input = document.createElement('input')
      input.type = 'hidden'
      input.name = key
      input.value = params[key]
      form.appendChild(input)
    }
    return form
  }

  const goEcpay = async (totalAmount, cartItems) => {
    try {
      // 把購物車商品名稱組合成字串 (綠界限制最多 200 字，可視情況截斷)
      const items = cartItems.map(i => i.product_name).join(', ')
      const shortItems = items.length > 400 ? items.slice(0, 397) + '...' : items

      const res = await fetch(
        `${apiURL}/ecpay-test-only?amount=${totalAmount}&items=${encodeURIComponent(shortItems)}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )

      const resData = await res.json()

      if (resData.status === 'success') {
        const ok = window.confirm('確認要導向至 ECPay (綠界) 進行付款？')
        if (ok) {
          const payForm = createEcpayForm(resData.data.params, resData.data.action)
          document.body.appendChild(payForm)
          payForm.submit()
          return true
        }
        return false
      } else {
        toast.error('付款失敗')
        return false
      }
    } catch (err) {
      console.error(err)
      toast.error('付款連線發生錯誤')
      return false
    }
  }


  const goLinePay = async (totalAmount) => {
    try {
      const res = await fetch(
        `${apiURL}/line-pay-test-only/reserve?amount=${totalAmount}`,
        {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )
      const resData = await res.json()

      if (resData.status === 'success' && typeof window !== 'undefined') {
        const ok = window.confirm('確認要導向至 LINE Pay 進行付款？')
        if (ok) {
          window.location.href = resData.data.paymentUrl
          return true
        }
        return false
      } else {
        toast.error('付款失敗')
        return false
      }
    } catch (err) {
      console.error(err)
      toast.error('付款連線發生錯誤')
      return false
    }
  }

  const handleCheckout = () => {
    // #region modal訊息
    if (!selectedDeliver) {
      setModalConfig({
        isOpen: true,
        message: "請先選擇運送方式",
        orderSummary: null,
        confirmAction: null
      });
      return;
    }

    if (selectedDeliver !== "711-noPay" && !selectedPayment) {
      setModalConfig({
        isOpen: true,
        message: "請先選擇付款方式",
        orderSummary: null,
        confirmAction: null
      });
      return;
    }

    if (!orderInfo.name || !orderInfo.email || !orderInfo.phone || (selectedDeliver === "HCT" && !orderInfo.address)) {
      setModalConfig({
        isOpen: true,
        message: "請完整填寫訂購人資料",
        orderSummary: null,
        confirmAction: null
      });
      return;
    }

    if (!recipientInfo.name || !recipientInfo.email || !recipientInfo.phone || (selectedDeliver === "HCT" && !recipientInfo.address)) {
      setModalConfig({
        isOpen: true,
        message: "請完整填寫收件人資料",
        orderSummary: null,
        confirmAction: null
      });
      return;
    }

    const deliverName = DELIVER_MAP[selectedDeliver] || "未知運送方式";
    const paymentKey = selectedDeliver === "711-noPay" ? "711-noPay" : selectedPayment;
    const paymentData = PAYMENT_MAP[paymentKey];

    if (!paymentData) {
      setModalConfig({
        isOpen: true,
        message: "付款方式錯誤，請重新選擇",
        orderSummary: null,
        confirmAction: null
      });
      return;
    }

    if ((selectedDeliver === "711-pay" || selectedDeliver === "711-noPay") && !store711?.storeid) {
      setModalConfig({
        isOpen: true,
        message: "請選擇取貨門市",
        orderSummary: null,
        confirmAction: null
      });
      return;
    }

    if (selectedDeliver === "HCT" && (!orderInfo.address || !recipientInfo.address)) {
      setModalConfig({
        isOpen: true,
        message: "請填寫運送地址",
        orderSummary: null,
        confirmAction: null
      });
      return;
    }

    if (
      (orderInfo.invoiceType === "phone" || orderInfo.invoiceType === "company") &&
      !orderInfo.invoiceValue
    ) {
      setModalConfig({
        isOpen: true,
        message: "請填寫發票資訊",
        orderSummary: null,
        confirmAction: null,
      });
      return;
    }
    // #endregion modal訊息

    const shippingFee = subtotal >= 1000 ? 0 : (SHIPPING_FEE_MAP[selectedDeliver] ?? 0);
    const discount = subtotal >= 1000 ? 50 : 0
    const totalAmount = subtotal + shippingFee - discount;


    const message =
      paymentKey === "711-noPay"
        ? `確定要用 ${deliverName} 嗎？`
        : `確定要用 ${deliverName} 並用 ${paymentData.name} 結帳嗎？`

    setModalConfig({
      isOpen: true,
      message,
      orderSummary: { subtotal, shippingFee, totalAmount, discount },
      confirmAction: async () => {
        localStorage.setItem("orderData", JSON.stringify({
          deliver: deliverName,
          payment: paymentData.name,
          address: selectedDeliver === "HCT" ? recipientInfo.address : store711.storename,
          recipientName: recipientInfo.name,
          recipientPhone: recipientInfo.phone,
          recipient: recipientInfo,
          invoiceType: orderInfo.invoiceType,
          invoiceValue: orderInfo.invoiceValue,
          subtotal,
          shippingFee,
          totalAmount,
          discount,
        }))

        if (paymentKey === 'line-pay') {
          // LINE Pay
          const redirected = await goLinePay(totalAmount)
          if (redirected) {
            setModalConfig(prev => ({ ...prev, isOpen: false }))
          }
        } else if (paymentKey === 'ecPay') {
          // ECPay
          const redirected = await goEcpay(totalAmount, cart.items)
          if (redirected) {
            setModalConfig(prev => ({ ...prev, isOpen: false }))
          }
        } else if (paymentData.url) {
          // 例如 7-11 貨到付款
          setModalConfig(prev => ({ ...prev, isOpen: false }))
          router.push(paymentData.url)
        } else {
          toast.error('付款方式配置錯誤')
        }
      }
    })
  };

  return (
    <>
      <div className='w-full px-6 md:px-32 py-[60px] flex flex-col justify-center items-center gap-10'>
        {/* step */}
        <div className="inline-flex flex-col justify-center items-center gap-1">
          <PawStep currentStep={2} />
        </div>

        {/* deliver */}
        <div className='w-full max-w-[1280px] flex flex-col gap-4'>
          <p className='text-base md:text-xl font-fp-semibold'>運送方式</p>
          <div className="w-full bg-white rounded-3xl flex flex-col p-6 md:p-12">
            <RadioGroup
              name="deliver"
              options={[
                { value: "HCT", label: "宅配 - 新竹貨運" },
                { value: "711-pay", label: "7-11 取貨不付款" },
                { value: "711-noPay", label: "7-11 取貨付款" },
              ]}
              size="md"
              onChange={setSelectedDeliver}
            />
          </div>
        </div>

        {/* payment */}
        {selectedDeliver !== "711-noPay" && (
          <div className='w-full max-w-[1280px] flex flex-col gap-4'>
            <p className='text-base md:text-xl font-fp-semibold'>付款方式</p>
            <div className="w-full bg-white rounded-3xl flex flex-col p-6 md:p-12">
              <RadioGroup
                name="payment"
                options={[
                  { value: "ecPay", label: "信用卡 - 綠界支付" },
                  { value: "line-pay", label: "Line Pay" },
                ]}
                size="md"
                onChange={setSelectedPayment}
              />
            </div>
          </div>
        )}

        {/* customer-info */}
        <div className='w-full max-w-[1280px] flex flex-col gap-4'>
          <p className='text-base md:text-xl font-fp-semibold'>購買人及收件人資料</p>
          <div className="w-full bg-white rounded-3xl flex flex-col md:flex-row py-6 md:py-12">

            {/* 訂購人 */}
            <div className='w-full md:w-[50%] px-6 md:px-12 lg:px-16'>
              <div className="flex flex-col gap-2 py-3">
                <p className='text-lg'>訂購人姓名</p>
                <Input
                  showIcon
                  iconComponent={FaCircleUser}
                  placeholder="請輸入訂購人姓名"
                  value={orderInfo.name}
                  onChange={(val) => setOrderInfo(prev => ({ ...prev, name: val }))}
                />
              </div>
              <div className="flex flex-col gap-2 py-3">
                <p className='text-lg'>電子信箱</p>
                <Input
                  showIcon
                  iconComponent={FaEnvelope}
                  type="email"
                  placeholder="請輸入電子郵件"
                  value={orderInfo.email}
                  onChange={(val) => setOrderInfo(prev => ({ ...prev, email: val }))}
                />
              </div>
              <div className="flex flex-col gap-2 py-3">
                <p className='text-lg'>電話號碼</p>
                <Input
                  showIcon
                  iconComponent={FaPhone}
                  type="tel"
                  placeholder="請輸入電話號碼"
                  value={orderInfo.phone}
                  onChange={(val) => setOrderInfo(prev => ({ ...prev, phone: val }))}
                />
              </div>
              {selectedDeliver == "HCT" && (
                <div className="flex flex-col gap-2 py-3">
                  <p className='text-lg'>訂購人地址</p>
                  <Input
                    showIcon
                    iconComponent={FaHouseChimney}
                    type="text"
                    placeholder="請輸入地址"
                    value={orderInfo.address}
                    onChange={(val) => setOrderInfo(prev => ({ ...prev, address: val }))}
                  />
                </div>
              )}
              {selectedDeliver !== "HCT" && (
                <button
                  onClick={() => { openWindow() }}
                  className="flex flex-row items-center gap-6 py-3">
                  <div className='flex flex-row items-center gap-3'>
                    <Image
                      width={50}
                      height={50}
                      src="/images/7_Eleven.png"
                      alt="7-11"
                    />
                    <input
                      type="text"
                      className='w-[150px] bg-white'
                      defaultValue={store711.storename || ''}
                      placeholder='選擇門市'
                      disabled />
                  </div>
                  <div className='w-[120] h-10 py-2 text-lg text-center  text-white bg-brand-warm hover:bg-primary rounded-full'>
                    選擇門市
                  </div>
                </button>
              )}
            </div>

            {/* 收件人 */}
            <div className='w-full md:w-[50%] px-6 md:px-12 lg:px-16'>
              {/*  同訂購人資料（改用 checkbox，受控） */}
              <CheckboxRadio
                name="recipient"
                value={recipientCheck}
                onChange={(val) => {
                  setRecipientCheck(val);
                  if (val === "same") {
                    // 勾選時複製
                    setRecipientInfo({ ...orderInfo });
                  }
                }}
                options={[{ value: "same", label: "同訂購人資料" }]}
                size="md"
              />

              <div className="flex flex-col gap-2 py-3">
                <p className='text-lg'>收件人姓名</p>
                <Input
                  showIcon
                  iconComponent={FaCircleUser}
                  placeholder="請輸入收件人姓名"
                  value={recipientInfo.name}
                  onChange={(val) => {
                    setRecipientInfo(prev => ({ ...prev, name: val }));
                    // 一旦手動修改，取消勾選
                    if (recipientCheck === 'same') setRecipientCheck('');
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 py-3">
                <p className='text-lg'>電子信箱</p>
                <Input
                  showIcon
                  iconComponent={FaEnvelope}
                  type="email"
                  placeholder="請輸入電子郵件"
                  value={recipientInfo.email}
                  onChange={(val) => {
                    setRecipientInfo(prev => ({ ...prev, email: val }));
                    if (recipientCheck === 'same') setRecipientCheck('');
                  }}
                />
              </div>
              <div className="flex flex-col gap-2 py-3">
                <p className='text-lg'>電話號碼</p>
                <Input
                  showIcon
                  iconComponent={FaPhone}
                  type="tel"
                  placeholder="請輸入電話號碼"
                  value={recipientInfo.phone}
                  onChange={(val) => {
                    setRecipientInfo(prev => ({ ...prev, phone: val }));
                    if (recipientCheck === 'same') setRecipientCheck('');
                  }}
                />
              </div>
              {selectedDeliver == "HCT" && (
                <div className="flex flex-col gap-2 py-3">
                  <p className='text-lg'>收件人地址</p>
                  <Input
                    showIcon
                    iconComponent={FaHouseChimney}
                    type="text"
                    placeholder="請輸入地址"
                    value={recipientInfo.address}
                    onChange={(val) => {
                      setRecipientInfo(prev => ({ ...prev, address: val }));
                      if (recipientCheck === 'same') setRecipientCheck('');
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* invoice */}
        <div className='w-full max-w-[1280px] flex flex-col gap-4'>
          <p className='text-base md:text-xl font-fp-semibold'>發票開立</p>
          <div className="w-full bg-white rounded-3xl flex flex-col p-6 md:p-12">
            <RadioGroup
              name="invoice"
              onChange={(val, extraVal) => {
                setOrderInfo(prev => ({
                  ...prev,
                  invoiceType: val,
                  invoiceValue: extraVal || ""
                }));
              }}
              options={[
                { value: "customer", label: "會員載具" },
                { value: "phone", label: "手機載具", showInputWhen: true, inputPlaceholder: "/XXXXXX " },
                { value: "company", label: "公司戶紙本收據", showInputWhen: true, inputPlaceholder: "請輸入公司行號統編" },
              ]}
            />
          </div>
        </div>

        {/* remind */}
        <div className="w-full max-w-[1280px] bg-white rounded-3xl flex flex-col px-6 py-7">
          <div className="[&>p]:text-[14px] [&>p]:leading-[24px] md:[&>p]:text-[16px]">
            <p>結帳須知</p>
            <p>．目前PETOPIA提供電子發票，若需紙本請填寫在訂單備註欄內</p>
            <p>．需要打統編的發票，請在發票類型欄選擇&lt;公司戶紙本發票&gt;，訂單完成後會以PDF檔寄至您提供的email中</p>
            <p>．本店支援 LINE Pay 付款，歡迎使用 LINE Pay 進行結帳</p>
          </div>
        </div>
      </div>

      <BottomBar
        onCheckout={handleCheckout}
        shippingFee={subtotal >= 1000 ? 0 : (SHIPPING_FEE_MAP[selectedDeliver] ?? 60)}
        discount={subtotal >= 1000 ? 50 : 0}
        subtotal={subtotal}
      />

      {/* Modal */}
      <Modal isOpen={modalConfig.isOpen} onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}>
        <div className="flex flex-col gap-6">
          <p className="text-lg font-semibold">{modalConfig.message}</p>

          {modalConfig.orderSummary && (
            <div className="bg-gray-100 rounded-lg p-4">
              <div className="flex justify-between py-1">
                <span>小計</span>
                <span>${modalConfig.orderSummary.subtotal}</span>
              </div>
              <div className="flex justify-between py-1">
                <span>運費</span>
                <span>${modalConfig.orderSummary.shippingFee}</span>
              </div>
              <div className="flex justify-between py-1 ">
                <span>折扣</span>
                <span>- ${modalConfig.orderSummary.discount}</span>
              </div>
              <div className="flex justify-between mt-8 pt-3 font-bold text-lg border-t border-dashed border-gray-400">
                <span>總金額</span>
                <span className="text-primary">${modalConfig.orderSummary.totalAmount}</span>
              </div>
              {/* 只有 7-11 取貨付款 才顯示 */}
              {selectedDeliver === "711-noPay" && (
                <p className="text-sm text-gray-600 mt-2">※ 本筆訂單將於取貨時付款</p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              onClick={() => setModalConfig({ ...modalConfig, isOpen: false })}
              className="px-6 py-2 bg-gray-300 hover:bg-gray-500 hover:text-white rounded-full"
            >
              取消
            </button>
            {modalConfig.confirmAction && (
              <button
                onClick={async () => {
                  // 交由 confirmAction 決定是否關閉 Modal
                  await modalConfig.confirmAction();
                }}
                className="px-6 py-2 bg-primary hover:bg-brand-warm text白 rounded-full"
              >
                確認
              </button>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
}
