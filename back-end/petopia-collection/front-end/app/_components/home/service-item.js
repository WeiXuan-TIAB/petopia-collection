'use client'

import Link from 'next/link'
import Image from 'next/image'

export default function ServiceItem({
  href,
  imageSrc,
  alt,
  title,
  description,
}) {
  return (
    <>
      <div className="w-1/3 lg:w-full aspect-square rounded-full overflow-hidden outline-4 lg:outline-0 outline-brand-warm outline-dotted outline-offset-2">
        <Link href={href}>
          <Image
            width={600}
            height={600}
            src={imageSrc}
            alt={alt}
            className="w-full select-none hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
      <div className="flex flex-col grow">
        <h3 className="text-3xl text-center border-b-4 lg:border-b-8 border-brand-warm border-dotted px-0 lg:px-4 py-2">
          {title}
        </h3>
        <p className="text-center py-2">
          {typeof description === 'string'
            ? description.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  <br />
                </span>
              ))
            : description}
        </p>
      </div>
    </>
  )
}
