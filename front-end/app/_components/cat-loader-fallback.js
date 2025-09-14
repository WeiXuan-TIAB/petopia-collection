'use client'
import dynamic from 'next/dynamic'
import styles from '@/hooks/use-loader/assets/loader.module.scss'
import catAnimation from '@/hooks/use-loader/assets/loader-cat.json'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

export default function CatLoaderFallback() {
  return (
    <div className="w-full text-center pt-24 text-gray-400">
      <Lottie className={styles['cat-loader']} animationData={catAnimation} />
      <p className="text-lg">貓貓努力工作中</p>
    </div>
  )
}
