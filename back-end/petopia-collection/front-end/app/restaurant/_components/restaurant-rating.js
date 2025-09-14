
import { FaRegStar } from "react-icons/fa6"
import { FaRegStarHalfStroke } from "react-icons/fa6"
import { FaStar } from "react-icons/fa6";

export default function RestaurantRating({ rating = 0 }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i}/>)
    } else if (i - rating <= 0.5) {
      stars.push(<FaRegStarHalfStroke key={i}/>)
    }
    else {
      stars.push(<FaRegStar key={i}/>)
    }
  }
  return (
    <>
      <div className="flex items-center gap-1 text-brand-warm">
        {stars} <span className="text-support-dark">{rating}</span> <span className="text-text-secondary">(根據最近的評分)</span>
      </div>
    </>
  )
}
