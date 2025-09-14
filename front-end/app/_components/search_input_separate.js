
import '@/styles/globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'    

export default function SearchInputSeparate() {
  return (
    <>
      {/* 最外層容器 - 兩個元素的水平佈局 */}
      <div className="
        flex 
        items-center 
        gap-4
        w-full
        max-w-lg
      ">
        
        {/* 搜尋輸入框區域 */}
        <div className="
          min-w-[240px]
          max-w-[350px]
          flex-1
          sm:w-[297px]
          md:w-[297px]
          h-10
          rounded-full
          border-2 border-primary
          bg-background-secondary
        ">
          {/* 輸入框內容容器 */}
          <div className="
            w-full 
            h-full 
            flex 
            items-center 
            px-5
          ">
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
          min-w-[100px]
          w-30
          sm:w-[120px]
          md:w-[120px]
          h-10
          rounded-full
          bg-primary
          flex-shrink-0
        ">
          {/* 按鈕內容容器 */}
          <div className="
            w-full 
            h-full 
            flex 
            items-center 
            justify-center 
            gap-2
            px-4
          ">
            {/* Search Icon 容器 */}
            <div className="flex-shrink-0">
              <FontAwesomeIcon 
                icon={faSearch} 
                className="w-4 h-4 text-icon-light" 
              />
            </div>

            {/* Button Text 容器 */}
            <div className="flex-shrink-0">
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