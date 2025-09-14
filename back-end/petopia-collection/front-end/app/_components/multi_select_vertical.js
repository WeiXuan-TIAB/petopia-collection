
import '@/styles/globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faChevronDown, faLocationDot } from '@fortawesome/free-solid-svg-icons'

export default function MultiSelectVertical() {
  return (
    <>
      {/* 最外層容器 - 設定響應式尺寸和垂直佈局 */}
      <div className="
        min-w-[240px] 
        max-w-[350px] 
        w-full
        sm:w-[260px] 
        md:w-[267px]
        flex
        flex-col
        gap-4
      ">
        
        {/* 用餐地區選擇區域 */}
        <div className="
          w-full
          h-10 
          rounded-full 
          bg-background-secondary
          border border-border-light
        ">
          {/* 地區內容容器 */}
          <div className="
            w-full 
            h-full 
            flex 
            items-center 
            px-4 
            gap-3
          ">
            {/* Location Icon 容器 */}
            <div className="flex-shrink-0">
              <FontAwesomeIcon 
                icon={faLocationDot} 
                className="w-4 h-4 text-text-secondary" 
              />
            </div>
            
            {/* Text 容器 */}
            <div className="flex-1 min-w-0">
              <span className="
                font-fake-pearl 
                font-normal 
                text-base
                leading-relaxed 
                tracking-normal 
                text-text-primary
                block
                truncate
              ">
                用餐地區
              </span>
            </div>

            {/* Dropdown Arrow 容器 */}
            <div className="flex-shrink-0">
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className="w-4 h-4 text-text-primary" 
              />
            </div>
          </div>
        </div>

        {/* 用餐日期選擇區域 */}
        <div className="
          w-full
          h-10 
          rounded-full 
          bg-background-secondary
          border border-border-light
        ">
          {/* 日期內容容器 */}
          <div className="
            w-full 
            h-full 
            flex 
            items-center 
            px-4 
            gap-3
          ">
            {/* Calendar Icon 容器 */}
            <div className="flex-shrink-0">
              <FontAwesomeIcon 
                icon={faCalendarDays} 
                className="w-4 h-4 text-text-secondary" 
              />
            </div>
            
            {/* Text 容器 */}
            <div className="flex-1 min-w-0">
              <span className="
                font-fake-pearl 
                font-normal 
                text-base
                leading-relaxed 
                tracking-normal 
                text-text-primary
                block
                truncate
              ">
                用餐日
              </span>
            </div>

            {/* Dropdown Arrow 容器 */}
            <div className="flex-shrink-0">
              <FontAwesomeIcon 
                icon={faChevronDown} 
                className="w-4 h-4 text-text-primary" 
              />
            </div>
          </div>
        </div>

        {/* 搜尋按鈕區域 */}
        <div className="
          w-full
          h-10 
          rounded-full 
          bg-primary
        ">
          {/* 按鈕內容容器 */}
          <div className="
            w-full 
            h-full
            flex 
            items-center 
            justify-center
          ">
            <span className="
              font-fake-pearl 
              font-medium 
              text-base
              leading-relaxed 
              tracking-normal 
              text-text-light
              whitespace-nowrap
            ">
              搜尋
            </span>
          </div>
        </div>

      </div>
    </>
  )
}