import Image from "next/image"

export default function CatSvg({classname=''}) {
  return (
    <Image
      width={108}
      height={108}
      src="../images/animal_svg/貓.svg"
      alt="貓貓專區"
      className={classname} />
  )
}
