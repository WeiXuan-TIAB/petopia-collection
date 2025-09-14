'use client'

import { motion } from 'framer-motion'
import ProductItem from './product-item'

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

export default function ProductGrid() {
  const data = [
    {
      href: '/product/info/1',
      imageSrc: '/images/product/list/product-1.png',
      productName: 'Royal Paws 高蛋白 80g（貓用）',
      productPrice: 'NT$ 280',
    },
    {
      href: '/product/info/2',
      imageSrc: '/images/product/list/product-2.png',
      productName: 'WhiskerJoy 清湯罐 100g（貓用）',
      productPrice: 'NT$ 420',
    },
    {
      href: '/product/info/3',
      imageSrc: '/images/product/list/product-3.png',
      productName: 'Felina Pro 魚乾 150g（貓用）',
      productPrice: 'NT$ 390',
    },
    {
      href: '/product/info/4',
      imageSrc: '/images/product/list/product-4.png',
      productName: 'PawGuard 腸胃敏感 200g（犬用）',
      productPrice: 'NT$ 400',
    },
  ]

  return (
    <motion.div
      className="flex flex-wrap justify-start"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }} // 滾動到 30% 高度時觸發
    >
      {data.map((item, index) => (
        <motion.div
          key={index}
          variants={cardVariants}
          className="w-1/2 lg:w-1/4"
        >
          <ProductItem {...item} />
        </motion.div>
      ))}
    </motion.div>
  )
}
