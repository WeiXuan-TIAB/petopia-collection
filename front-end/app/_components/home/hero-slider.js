'use client'

import 'slick-carousel/slick/slick.css'
import '@/styles/slick-theme-custom.css'

import React from 'react'
import Slider from 'react-slick'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroSlider() {
  var settings = {
    arrows: false,
    dots: true,
    fade: true,
    autoplay: true,
    autoplaySpeed: 4000,
    infinite: true,
    speed: 1500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }
  return (
    <Slider {...settings}>
      <div>
        <Link href={'/'}>
          <div className="relative mb-4">
            <Image
              width={2000}
              height={1333}
              src="/images/home/hero-1.jpg"
              alt="hero image"
              className="w-full aspect-2/1 rounded-4xl"
              priority
            ></Image>
            {/* <h2 className="w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xl lg:text-4xl text-center text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.66)] tracking-widest">
              與毛孩共享生活的美好時光
            </h2> */}
            <h2 className="absolute top-4 xl:top-16 right-14 xl:right-16 text-xl lg:text-4xl text-right text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.66)] tracking-widest">
              與毛孩共享生活的美好時光
            </h2>
          </div>
        </Link>
      </div>
      <div>
        <Link href={'/'}>
          <div className="relative mb-4">
            <Image
              width={2000}
              height={1333}
              src="/images/home/hero-2.jpg"
              alt="hero image"
              className="w-full aspect-2/1 rounded-4xl"
            ></Image>
            <h2 className="absolute top-1/2 left-4 xl:left-16 -translate-y-1/2 text-xl lg:text-4xl text-left text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.66)] tracking-widest">
              每一刻陪伴<br />都是幸福的開始
            </h2>
          </div>
        </Link>
      </div>
    </Slider>
  )
}
