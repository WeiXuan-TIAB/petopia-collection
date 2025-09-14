import Image from 'next/image'
import { FaTrash } from 'react-icons/fa6'
import Counter from '@/app/_components/cards/counter'
import { useCart } from '@/hooks/use-cart-state/cart-provider'

export default function CartProductItem({ productInfo }) {
  const { updateItemQty, removeItem } = useCart()

  return (
    <div className='w-full flex flex-row justify-between text-fp-body md:text-fp-h5'>
      <div className='w-full flex flex-col lg:flex-row'>
        {/* 商品圖片與名稱 */}
        <div className='flex-1 text-center flex justify-start items-center px-4 md:px-10 lg:px-14 py-4 gap-4'>
          <Image
            width={80}
            height={80}
            alt={productInfo.product_name}
            src={productInfo.mainImage || '/images/product/placeholder.png'}
            className='w-[80px] h-[80px] rounded-lg object-cover'
          />
          <div className='flex flex-col'>
            <div>{productInfo.product_name} / {productInfo.var}</div>
            <div className='flex justify-start lg:hidden'>NT$ {productInfo.price}</div>
          </div>
        </div>

        {/* 單價 */}
        <div className='w-[200px] text-center hidden lg:flex justify-start md:justify-center px-6 pt-7 pb-5 items-center'>
          NT$ {productInfo.price}
        </div>

        {/* 數量 */}
        <div className='w-[250px] text-center flex justify-start md:justify-center px-3 md:px-6 pt-3 md:pt-7 pb-5 items-center'>
          <Counter
            value={productInfo.quantity}
            onChange={(qty) => updateItemQty(productInfo.id, qty)}
          />
        </div>
      </div>
      
      {/* 刪除按鈕 */}
      <button
        onClick={() => removeItem(productInfo.id)}
        className='w-[60px] md:w-[100px] text-center flex justify-center items-center px-4 md:px-6 pt-5 md:pt-7 pb-5 text-button-like'
      >
        <FaTrash />
      </button>
    </div>
  )
}
