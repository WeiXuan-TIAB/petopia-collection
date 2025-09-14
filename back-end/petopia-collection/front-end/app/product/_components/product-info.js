'use client'
import '@/styles/globals.css'
import { useState } from 'react'
import ProductImgSlide from './product-img-slide'
import StarGroup from '@/app/_components/star-group'
import BtnShop from '@/app/_components/buttons/btn-shop'
import Counter from '@/app/_components/cards/counter'
import TagGroup from '@/app/_components/tag-group'

export default function ProductInfo({
  memberId,
  productId,
  productName,
  productDesc,
  productPrice,
  productRate = 0,
  productImgs = [],
  productVar = {},
}) {
  const [selectedVar, setSelectedVar] = useState(productVar[0] || '')
  const [quantity, setQuantity] = useState(1)

  // 如果圖片不滿4張  補滿圖片數量
  const minImages = 4;
  let displayImages = [
    productImgs?.main || '/images/no-image.png',
    ...(productImgs?.minor || [])
  ].filter(Boolean);

  while (displayImages.length < minImages) {
    displayImages.push(displayImages[0]);
  }

  return (
    <>
      <div className='flex flex-col md:flex-row justify-center gap-8'>
        <div >
          <ProductImgSlide
            memberId={memberId}
            productImages={
              [
                productImgs.main,
                ...(productImgs.minor || [])
              ].filter(Boolean) //過濾 null / undefined / 空字串
            }
            productName={productName}
            price={productPrice}
            productId={productId} />
        </div>
        <div className='flex flex-col gap-6 w-full md:w-[45%]'>
          {/* Title+desc */}
          <div className='flex flex-col gap-2 '>
            <h3 className='text-fp-h2'>{productName}</h3>
            <p className='text-sm md:text-base'>{productDesc}</p>
          </div>
          {/* StarRate */}
          <div className='flex items-end leading-4 gap-4'>
            <StarGroup rating={productRate} />
            <p>{productRate}</p>
          </div>
          {/* 規格 Tag */}
          {productVar.colors?.length > 0 && (
            <TagGroup
              label="顏色"
              content={productVar.colors}
              selectedVar={selectedVar}
              setSelectedVar={setSelectedVar}
            />
          )}
          {productVar.sizes?.length > 0 && (
            <TagGroup
              label="尺寸"
              content={productVar.sizes}
              selectedVar={selectedVar}
              setSelectedVar={setSelectedVar}
            />
          )}
          {productVar.flavors?.length > 0 && (
            <TagGroup
              label="口味"
              content={productVar.flavors}
              selectedVar={selectedVar}
              setSelectedVar={setSelectedVar}
            />
          )}
          <TagGroup content={productVar} selectedVar={selectedVar} setSelectedVar={setSelectedVar} />
          {/* counter+shopBtn */}
          <div className='mt-auto '>
            <p className='text-fp-h4' >NT$ {productPrice}</p>
            <div className='flex flex-col lg:flex-row gap-4 mt-4'>
              <Counter
                value={quantity}
                onChange={(quantity) => setQuantity(quantity)}
              />
              <BtnShop
                productId={productId}
                productName={productName}
                productVar={selectedVar}
                price={productPrice}
                mainImage={productImgs.main}
                qty={quantity}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
