import PawStepIcon from "@/app/_components/icon/paw-step-icon";

export default function PawStep({ currentStep = 1 }) {
  const stepText = ["商品確認", "付款與運送", "訂單確認"]
  return (
    <div className="flex justify-between w-[300px]  md:w-[450px]  lg:w-[800px]">
      {[1, 2, 3].map((step) => {
        const isActive = step === currentStep
        return (
          <div key={step} className="inline-flex flex-col justify-center items-center gap-2">
            <PawStepIcon step={step} 
            color={isActive ? "primary" : "primary2"} />
            <div className={`text-center justify-start ${isActive ? "text-primary" : "text-primary2" } text-base md:text-lg font-normal font-['FakePearl'] leading-tight`}>{stepText[step - 1]}
            </div>
          </div>
        )
      })}
    </div>

  )
}