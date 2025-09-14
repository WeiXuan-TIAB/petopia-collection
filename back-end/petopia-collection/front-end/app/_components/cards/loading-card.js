export default function LoadingCard() {

  return (
      <div className=" w-full flex flex-col items-center justify-center p-4 gap-2 animate-pulse">
        <div className="w-full h-full aspect-square rounded-2xl md:rounded-5xl  bg-gray-300">
        </div>
        <div className="self-stretch flex flex-col justify-start items-center gap-2">
          <div className="w-full h-7 text-fp-h5 text-center truncate bg-gray-300"></div>
          <div className="w-full h-5 text-fp-body text-center bg-gray-300"></div>
        </div>
      </div>
  )
}