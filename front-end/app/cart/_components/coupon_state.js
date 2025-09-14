export default function CouponState({ state = true, activity = "" }) {
  return (
    <>
      <div className="flex flex-row gap-4 items-center">
        <div className={`w-fit px-4 py-2 border-[1px] rounded-full ${state ? " border-border-primary text-text-bprimary":"border-black/50 text-black/50"}`}>
          {state ? "符合活動" : "不符合條件"}  </div> 
        <div>{activity}</div>
      </div>
    </>
  )
}

        {/* {state
          ? <div className="w-fit px-4 py-2 border-[1px] border-border-primary text-text-bprimary rounded-full">
            符合活動
          </div>
          : <div className="w-fit px-4 py-2 border-[1px] border-black/50 text-black/50 rounded-full">
            不符合條件
          </div>} */}