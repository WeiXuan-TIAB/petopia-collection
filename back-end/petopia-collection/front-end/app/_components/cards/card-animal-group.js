import { motion } from 'framer-motion'
import CardCat from '@/app/_components/cards/card-cat'
import CardDog from '@/app/_components/cards/card-dog'
import CardUnusual from '@/app/_components/cards/card-unusual'
import CardReptile from '@/app/_components/cards/card-reptile'

export default function CardAnimalGroup({onSelect}) {
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
  return (
    <motion.div
      className="flex flex-wrap justify-between"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }} // 滾動到 30% 高度時觸發
    >
      <div className='w-full flex-wrap flex items-end justify-center gap-8'>
        <motion.div className='order-1'
          variants={cardVariants}
          onClick={() => onSelect(1)}
        ><CardCat />
          
        </motion.div>
        <motion.div  className='order-2'
          variants={cardVariants}
          onClick={() => onSelect(2)}
        ><CardDog />

        </motion.div>
        <motion.div className=' order-4 md:order-3'
          variants={cardVariants}
          onClick={() => onSelect(3)}
        >
          <CardUnusual />
          </motion.div>
        <motion.div  className=' order-3 md:order-4'
          variants={cardVariants}
          onClick={() => onSelect(4)}
        >
          <CardReptile />
          </motion.div>
      </div>
    </motion.div>
  )
}