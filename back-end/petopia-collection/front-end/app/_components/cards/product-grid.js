'use client'

import { motion } from 'framer-motion'
import CardProduct from './card-product'

// 動畫設定
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.3 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function ProductGrid({ products = [] }) {
  // 先把清單正規化成卡片要的 props
  const normalized = products.map((p) => {

    return {
      id: p.id,
      product_name: p.product_name,
      price: p.price,
      mainImage:p.mainImage,
      productVar:p.defaultSpec
    }
  })

  return (
    <motion.div
      key={normalized.map((p) => p.id).join('-')}
      className="flex flex-wrap justify-start"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {normalized.map((item) => (
        <motion.div
          key={item.id}
          variants={cardVariants}
          className="w-1/2 lg:w-1/4"
        >
          <CardProduct {...item} />
        </motion.div>
      ))}
    </motion.div>
  )
}
