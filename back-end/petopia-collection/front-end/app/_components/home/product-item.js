'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function ProductItem({
  href,
  imageSrc,
  productName,
  productPrice,
}) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center p-4 gap-2"
      title={productName}
    >
      <div className="w-full aspect-square rounded-2xl overflow-hidden">
        <Image
          width={600}
          height={600}
          src={imageSrc}
          alt={productName}
          className="w-full select-none hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="w-full text-lg text-center truncate">{productName}</div>
      <div className="w-full text-lg text-center">{productPrice}</div>
    </Link>
  )
}
