'use client'

import { motion } from 'framer-motion'
import ServiceItem from './service-item'

// 動畫設定
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: 'easeOut' },
  },
}

export default function ServiceGrid() {
  const data = [
    {
      href: '/product',
      imageSrc: '/images/home/service-1.jpg',
      alt: '買買',
      title: '買買',
      description: '精選高品質寵物用品滿足\n毛孩的每一個小需求',
    },
    {
      href: '/travel',
      imageSrc: '/images/home/service-2.jpg',
      alt: '玩玩',
      title: '玩玩',
      description: '規劃專屬毛孩的旅遊行程\n開啟快樂的探索旅程',
    },
    {
      href: '/restaurant',
      imageSrc: '/images/home/service-3.jpg',
      alt: '吃吃',
      title: '吃吃',
      description: '發掘全台寵物友善餐廳\n與毛孩共享美味時光',
    },
    {
      href: '/map',
      imageSrc: '/images/home/service-4.jpg',
      alt: '逛逛',
      title: '逛逛',
      description: '地圖導覽寵物友善景點\n出門不再煩惱去哪玩',
    },
    {
      href: '/forum',
      imageSrc: '/images/home/service-5.jpg',
      alt: '聊聊',
      title: '聊聊',
      description: '飼主論壇分享心得\n交流養寵經驗與樂趣',
    },
  ]

  return (
    <motion.div
      className="flex flex-wrap justify-between"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }} // 滾動到 30% 高度時觸發
    >
      {data.map((item, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          className="group w-full lg:w-1/5 flex odd:flex-row even:flex-row-reverse lg:odd:flex-col lg:even:flex-col items-center justify-center p-4 gap-2"
        >
          <ServiceItem {...item} />
        </motion.div>
      ))}
    </motion.div>
  )
}
