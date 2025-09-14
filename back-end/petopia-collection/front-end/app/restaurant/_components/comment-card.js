'use client'

import Image from 'next/image'
import RestaurantRating from './restaurant-rating'

export default function CommentCard({
  avatar,
  nickname,
  date,
  rating,
  comment,
}) {
  return (
    <div className="flex flex-col gap-4 py-8 border-b-2 border-dotted border-brand-warm">
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 aspect-square rounded-full overflow-hidden">
          <Image
            src={avatar}
            width={600}
            height={600}
            alt="comment avatar"
            className="w-full select-none"
          />
        </div>
        <div>{nickname}</div>
      </div>
      <div className="flex">
        <RestaurantRating rating={rating} />
        <div className="ml-2">在{date}用過餐</div>
      </div>
      <div>{comment}</div>
    </div>
  )
}
