'use client'
import '@/styles/globals.css'

import Link from 'next/link'
import Image from 'next/image'
import HeroSlider from '@/app/_components/home/hero-slider'
import ServiceGrid from '@/app/_components/home/service-grid'
import ProductGrid from './_components/cards/product-grid'
import { useGetRecommendProducts } from '@/services/rest-client/use-product'

export default function HomePage() {
  const { recommendProducts } = useGetRecommendProducts()
  return (
    <>
      <section className="w-full px-4 pb-10 lg:pb-20">
        <div className="container mx-auto">
          <HeroSlider></HeroSlider>
        </div>
      </section>

      <section className="w-full px-4 py-10 lg:py-20">
        <div className="container mx-auto">
          <h4 className="text-xl xl:text-2xl text-center text-brand-warm mb-1 lg:mb-2">
            今天、明天、每一天
          </h4>
          <h2 className="text-3xl xl:text-5xl text-center text-primary mb-4 lg:mb-8">
            探索生活小確幸
          </h2>
          <div className="flex flex-col lg:flex-row gap-4">
            <ServiceGrid />
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-10 lg:py-20">
        <div className="container mx-auto">
          <h4 className="text-sm xl:text-xl text-center text-brand-warm mb-1 lg:mb-2">
            Recommended
          </h4>
          <h2 className="text-3xl xl:text-5xl text-center text-primary mb-4 lg:mb-8">
            好物推薦
          </h2>
          <div className="flex flex-row flex-wrap">
            <ProductGrid products={recommendProducts}/>
          </div>
        </div>
      </section>

      <section className="w-full bg-white px-4 py-10 lg:py-20">
        <div className="container mx-auto">
          <div className="flex flex-col xl:flex-row gap-8">
            <div className="basis-full xl:basis-4/7">
              <Image
                width={575}
                height={449}
                src="/images/home/travel-1.png"
                alt="毛起來 我們旅行趣"
                className="w-full"
              ></Image>
            </div>
            <div className="basis-full xl:basis-3/7 flex flex-col justify-center gap-4">
              <div className="flex flex-col">
                <h4 className="xl:text-xl text-center xl:text-start text-primary lg:mb-2">
                  Explore nature with our furry friends
                </h4>
                <h2 className="text-2xl lg:text-5xl text-center xl:text-start text-secondary mb-2 lg:mb-8">
                  毛起來 我們旅行趣
                </h2>
              </div>
              <p className="xl:text-xl">
                為你與毛孩打造一段溫柔的旅程，不只是旅行，更是一起探索世界的陪伴時光。
              </p>
              <p className="xl:text-xl">
                從台灣的花蓮海岸、台中寵物旅宿，到日本東京、北海道、福岡的友善公園，再到韓國首爾漢江、水原步道，我們為你精選亞洲三地的寵物友善景點與行程，讓毛孩能自在奔跑、安心入住，一起留下旅行足跡。
              </p>
              <p className="xl:text-xl">現在就出發，毛起來玩吧！</p>
              <div className="flex justify-end mt-4">
                <Link
                  href="/travel"
                  className="w-full xl:w-auto block xl:inline-block bg-primary text-xl text-white text-center py-3 px-8 rounded-full hover:bg-brand-warm transition-colors duration-300"
                >
                  找趣事
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-4 py-10 lg:py-20">
        <div className="container mx-auto">
          <div className="flex flex-col-reverse xl:flex-row gap-8">
            <div className="basis-full xl:basis-3/5 flex flex-col justify-center gap-4">
              <div className="flex flex-col">
                <h4 className="xl:text-xl text-center xl:text-start text-primary lg:mb-2">
                  Every moment together begins with joy.
                </h4>
                <h2 className="text-2xl lg:text-5xl text-center xl:text-start text-secondary mb-2 lg:mb-8">
                  每一刻陪伴，都是幸福的開始。
                </h2>
              </div>
              <p className="xl:text-xl">
                Petopia
                是一個專屬於寵物與飼主的幸福園地。我們深知每一位毛孩，都是家人般的存在，因此用心打造一個充滿溫度與便利的寵物友善平台。無論是為毛孩選購安心的
                寵物用品商城，還是與牠們一起出門旅行、探索世界，我們都為您準備了貼心的服務與建議。
              </p>
              <p className="xl:text-xl">
                Petopia 的
                寵物旅遊行程與友善餐廳訂位功能，讓您不再為出遊而煩惱。我們的地圖導覽，幫助您快速找到附近的寵物公園、咖啡廳或診所，讓毛孩隨時都能開心玩樂、安心出行。除此之外，飼主心得論壇更是您交流心情與經驗的溫暖社群，讓每段養寵故事都能被聆聽與分享。
              </p>
              <p className="xl:text-xl">
                我們相信，養寵不只是照顧，而是一段用愛編織的幸福旅程。Petopia
                將與您一同，陪伴毛孩每一天的笑容。
              </p>
              
            </div>
            <div className="basis-full xl:basis-2/5 flex flex-col justify-center align-center">
              <Image
                width={1000}
                height={667}
                src="/images/home/about-1.jpg"
                alt="About Us"
                className="w-full aspect-16/9 rounded-tl-8xl rounded-br-8xl"
              ></Image>
            </div>
          </div>
        </div>
      </section>

      
    </>
  )
}
