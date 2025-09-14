'use client'

import { motion } from 'framer-motion'
import LoadingCard from './loading-card'

// 動畫設定
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.3 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function LoadingGrid() {
  return (
    <motion.div
      className="w-full flex flex-wrap justify-start"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {Array(8)
        .fill(null)
        .map((_, i) => (
          <motion.div
            key={i}
            variants={cardVariants}
            className="w-1/2 lg:w-1/4"
          >
            <LoadingCard />
          </motion.div>
        ))}
    </motion.div>
  )
}
