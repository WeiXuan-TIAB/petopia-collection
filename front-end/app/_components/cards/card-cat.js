import Image from "next/image";

export default function CardCat() {
  return (
    <div className="w-[150px] h-40 px-2 inline-flex justify-start items-end gap-2.5 group cursor-pointer">
      <div className="flex-1 inline-flex flex-col justify-start items-center">
        <Image 
        width={108} 
        height={108} 
        className="relative z-10 w-auto h-auto" 
        src="/images/animal_svg/貓.svg" 
        alt="貓貓專區" 
        unoptimized
        priority
        />
        <div className="self-stretch w-[134px] h-[138px] py-2 bg-primary4 rounded-tl-[200px] rounded-tr-[200px] rounded-bl-[52px] rounded-br-[52px] 
        transition-all duration-300  
        group-hover:shadow-[0px_10px_25px_0px_rgba(0,0,0,0.25)] group-hover:bg-primary 
        inline-flex justify-center items-end -mt-[90px]">
          <div className="text-center justify-start text-white text-xl font-normal font-['FakePearl'] leading-loose">貓貓專區</div>
        </div>
      </div>
    </div>
  )
}