// components/ProductImgSlide.jsx
'use client'
import { useState, useEffect, useRef } from 'react'
import Slider from 'react-slick'
import Image from 'next/image'
import 'slick-carousel/slick/slick.css'
import BtnLike from '@/app/_components/buttons/btn-like'

export default function ProductImgSlide({ productImages,price, productName, productId, memberId }) {
  const [nav1, setNav1] = useState(null)
  const [nav2, setNav2] = useState(null)
  const slider1 = useRef(null)
  const slider2 = useRef(null)

    const productData = {
    id: productId,
    product_name: productName,
    price: price,
    mainImage: productImages[0],
  }
  useEffect(() => {
    setNav1(slider1.current)
    setNav2(slider2.current)
  }, [])

  const placeholder = '/images/product/placeholder.png'
  const imagesToShow = [...productImages]

  while (imagesToShow.length < 4) {
    imagesToShow.push(placeholder)
  }

  return (
    <div className="w-full max-w-[400px] relative"
      onMouseEnter={() => slider1.current?.slickPause()}
      onMouseLeave={() => slider1.current?.slickPlay()}>
      <Slider
        asNavFor={nav2}
        ref={slider1}
        arrows={false}
        infinite={true}
        className="mb-4"
        autoplay={true}
        autoplaySpeed={3000}
        pauseOnHover={true}
      >
        {imagesToShow.map((src, index) => (
          <div key={index} className=' relative'>
            <Image
              src={src}
              width={400}
              height={400}
              alt={`主圖 ${index + 1}`}
              className="w-full object-cover rounded-2xl"
            />
          </div>
        ))}
      </Slider>
      <div className='absolute top-3 right-3 z-10'>
        <BtnLike
          productId={productId}
          productName={productName}
          memberId={memberId}
          productData={productData}
        />
      </div>

      <Slider
        asNavFor={nav1}
        ref={slider2}
        slidesToShow={4}
        swipeToSlide={true}
        focusOnSelect={true}
        arrows={false}
        infinite={true}
      >
        {imagesToShow.map((src, index) => (
          <div key={index} className="px-1">
            <Image
              src={src}
              width={150}
              height={150}
              alt={`縮圖 ${index + 1}`}
              className="w-full object-cover rounded-xl border hover:border-primary transition"
              unoptimized
            />
          </div>
        ))}
      </Slider>
    </div>
  )
}