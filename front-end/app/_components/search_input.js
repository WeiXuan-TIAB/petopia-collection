
import '@/styles/globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export default function SearchInput() {
  return (
    <>
      {/* 最外層容器 - 設定響應式尺寸和整體樣式 */}
      <div className="
        min-w-[280px] 
        max-w-[500px] 
        w-full
        sm:w-[350px] 
        md:w-[400px]
        h-10 
        rounded-full 
        border-2 border-primary
        bg-background-secondary
        overflow-hidden
      ">
        {/* 內容容器 - 輸入區域和按鈕的 Flex 佈局 */}
        <div className="
          w-full 
          h-full 
          flex
        ">
          
          {/* 搜尋輸入區域 */}
          <div className="
            flex-1 
            min-w-0
          ">
            {/* 輸入內容容器 */}
            <div className="
              w-full 
              h-full 
              flex 
              items-center 
              pl-5 
              pr-4 
              gap-3
            ">
              {/* Search Icon 容器 */}
              <div className="flex-shrink-0">
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="w-4 h-4 text-text-secondary" 
                />
              </div>
              
              {/* Placeholder Text 容器 */}
              <div className="flex-1 min-w-0">
                <span className="
                  font-fake-pearl 
                  font-normal 
                  text-base
                  leading-relaxed 
                  tracking-normal 
                  text-text-secondary
                  block
                  truncate
                ">
                  請輸入關鍵字
                </span>
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
              h-full
              rounded-r-full
              bg-primary
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
      </div>
    </>
  )
}