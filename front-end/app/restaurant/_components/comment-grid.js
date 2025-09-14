'use client'

import { motion } from 'framer-motion'
import CommentCard from './comment-card'

// 動畫設定
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, x: 50 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 1, ease: 'easeOut' },
  },
}

export default function CommentGrid() {
  const data = [
    {
      avatar: '/images/restaurant/placeholder.png',
      nickname: '小明',
      date: '2025/07/20',
      rating: '4.1',
      comment:
        '第一次帶狗狗來「毛起來嗑」，餐點不只對毛孩很用心，連人類餐點都超美味！店員還幫忙拍了好多可愛照片，下次一定再來！',
    },
    {
      avatar: '/images/restaurant/placeholder.png',
      nickname: '小華',
      date: '2025/07/01',
      rating: '4.1',
      comment:
        '這裡環境超友善，狗狗可以自在玩耍，鮮食套餐讓牠吃得乾乾淨淨！我最喜歡店裡的招牌早午餐，份量足又超好拍照！',
    },
  ]

  return (
    <motion.div
      className="flex flex-col"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }} // 滾動到 30% 高度時觸發
    >
      {data.map((item, index) => (
        <motion.div key={index} variants={cardVariants}>
          <CommentCard {...item} />
        </motion.div>
      ))}
    </motion.div>
  )
}
