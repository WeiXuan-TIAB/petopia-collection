import Image from "next/image";

export default function Banner({ imgUrl = '', title = '' }) {
  return (
    <>
        <div className="relative w-full h-[200px] overflow-hidden rounded-2xl ">
          <Image
            src={imgUrl}
            alt={title}
            fill
            className="object-cover object-[center_63%] saturate-55 "
            priority
          />
        </div>
    </>
  )
}

