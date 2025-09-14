import StarDefault from "./icon/star-default"
import StarClick from "./icon/star-click"
import StarHelf from "./icon/star-helf"

export default function StarGroup({ rating = 0 ,color="#EE5A36"}) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<StarClick key={i} color={color}/>)
    } else if (i - rating <= 0.5) {
      stars.push(<StarHelf key={i} color={color}/>)
    }
    else {
      stars.push(<StarDefault key={i} color={color}/>)
    }
  }
  return (
    <>
      <div className="flex w-[150px] gap-2">
        {stars}
      </div>
    </>
  )
}
