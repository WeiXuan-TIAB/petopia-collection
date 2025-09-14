'use client'
import '@/styles/globals.css'
import { useParams } from 'next/navigation'
import {
  useGetProduct,
  useGetProductReviews,
  useGetRecommendProducts
} from '@/services/rest-client/use-product'
import ProductGrid from '@/app/_components/cards/product-grid'
import ProductInfo from '../../_components/product-info'
import FeedbackGroup from '@/app/_components/feedback-group'
import Image from 'next/image'
// import FeedbackGroup from '@/app/_components/feedback-group'

export default function ProductListPage() {
  const { pid } = useParams()
  const { product, isLoading, error } = useGetProduct(pid)
  const { reviews } = useGetProductReviews(pid)
  const { recommendProducts } = useGetRecommendProducts()

  if (isLoading) return <div>載入中...</div>
  if (error) return <div>發生錯誤：{error.message}</div>
  const fakeRate = product.rate ?? (Math.random() * 1.5 + 3.5).toFixed(1);

  return (
    <>
      <div className='px-6 lg:px-24 py-8 md:py-16 flex flex-col justify-center md:items-center'>
          <ProductInfo
            productId={product.id}
            productName={product.product_name}
            productDesc={product.product_desc}
            productPrice={product.price}
            productRate={fakeRate}
            productImgs={product.images}
            productVar={product.specs}
          />
        <div className='w-fill max-w-[960px] mt-8'>
          <Image
            src="/images/product/info/product-1.png"
            alt="info-1"
            width={960}
            height={1}
            className="w-full h-auto"
            unoptimized
          />
          <Image
            src='/images/product/info/product-2.png'
            alt="info-2"
            width={960}
            height={1}
            className="w-full h-auto"
            unoptimized
          />
          <Image
            src='/images/product/info/product-3.png'
            alt="info-3"
            width={960}
            height={1}
            className="w-full h-auto"
            unoptimized
          />
          <Image
            src='/images/product/info/product-4.png'
            alt="info-4"
            width={960}
            height={1}
            className="w-full h-auto"
            unoptimized
          />
        </div>
        <div className='max-w-[1000px] w-full'>
          <h2 className="text-4xl text-center text-primary mt-7 mb-4 lg:mb-8">好評回饋</h2>
          <FeedbackGroup customerInfos={reviews} />
        </div>
        <div className='max-w-[1000px] w-full'>
          <h2 className="text-4xl text-center text-primary mt-7 mb-4 lg:mb-8">推薦商品</h2>
          <ProductGrid products={recommendProducts} />
        </div>
      </div>
    </>
  )
}
