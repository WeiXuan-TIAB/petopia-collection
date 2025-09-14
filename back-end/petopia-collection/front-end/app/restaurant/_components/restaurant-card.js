'use client'

import Link from 'next/link'
import { FaLocationDot } from 'react-icons/fa6'
import RestaurantRating from './restaurant-rating'
import Thumbnail from './thumbnail'

export default function RestaurantCard({
  id,
  imageSrc,
  restaurantName,
  restaurantType,
  restaurantRating,
  restaurantLocation,
  restaurantDescription,
}) {
  return (
    <Link
      href={`/restaurant/${id}`}
      className="flex items-start justify-start p-4 gap-4 bg-white/70 hover:bg-white/90 hover:shadow-xl hover:shadow-[#f0cdba] transition-shadow duration-300 rounded-4xl"
      title={restaurantName}
    >
      <div className="w-28 md:w-40 aspect-square rounded-2xl overflow-hidden flex-shrink-0 relative">
        <Thumbnail
          width={600}
          height={600}
          src={imageSrc}
          alt={restaurantName}
          className="w-full select-none hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex flex-col gap-1 md:gap-2">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <div className="flex flex-shrink-0 text-sm bg-primary text-white px-2 py-1 rounded-full">
            {restaurantType}
          </div>
          <div className="text-lg md:text-xl text-wrap">{restaurantName}</div>
        </div>
        <div className="flex gap-2 items-center text-sm">
          <RestaurantRating rating={restaurantRating} />
        </div>
        <div className="text-sm flex gap-1 items-center">
          <FaLocationDot />
          {restaurantLocation}
        </div>
        <div className="hidden md:block text-sm">{restaurantDescription}</div>
      </div>
    </Link>
  )
}
