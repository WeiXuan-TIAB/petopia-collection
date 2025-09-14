
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarDays, faChevronDown, faLocationDot } from '@fortawesome/free-solid-svg-icons'

export default function MultiSelect() {
  return (
    <>
      {/* 最外層容器 - 設定響應式尺寸和整體樣式 */}
      <div className="
        min-w-[320px] 
        max-w-[600px] 
        w-full
        sm:w-[400px] 
        md:w-[496px]
        h-10 
        rounded-full 
        border-2 border-primary
        bg-background-secondary
        overflow-hidden
      ">
        {/* 內容容器 - 三個區域的 Flex 佈局 */}
        <div className="
          w-full 
          h-full 
          flex
        ">
          
          {/* 用餐地區區域 */}
          <div className="
            flex-1 
            min-w-0
            border-r border-primary
          ">
            {/* 地區內容容器 */}
            <div className="
              w-full 
              h-full 
              flex 
              items-center 
              px-4 
              gap-2
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
                  text-sm
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
                  className="w-3 h-3 text-text-primary" 
                />
              </div>
            </div>
          </div>

          {/* 用餐日期區域 */}
          <div className="
            flex-1 
            min-w-0
          ">
            {/* 日期內容容器 */}
            <div className="
              w-full 
              h-full 
              flex 
              items-center 
              px-4 
              gap-2
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
                  text-sm
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
                  className="w-3 h-3 text-text-primary" 
                />
              </div>
            </div>
          </div>

          {/* 搜尋按鈕區域 */}
          <div className="
            w-20
            flex-shrink-0
          ">
            {/* 按鈕內容容器 */}
            <div className="
              w-full 
              h-9
              rounded-r-full
              bg-primary
              flex 
              items-center 
              justify-center
            ">
              <span className="
                font-fake-pearl 
                font-medium 
                text-sm
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
      </div>
    </>
  )
}