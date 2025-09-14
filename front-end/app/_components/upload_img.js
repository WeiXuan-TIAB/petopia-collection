
import '@/styles/globals.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons'

export default function UploadImg() {
  return (
    <>
      {/* 最外層容器 - 設定響應式尺寸和整體樣式 */}
      <div className="
        min-w-[280px] 
        max-w-[400px] 
        w-full
        sm:w-[350px]
        md:w-[400px]
        h-10 
        rounded-full 
        border-2 border-primary
        bg-background-secondary
        overflow-hidden
      ">
        {/* 內容容器 - 上傳區域和按鈕的 Flex 佈局 */}
        <div className="
          w-full 
          h-full 
          flex
        ">
          
          {/* 上傳提示區域 */}
          <div className="
            flex-1 
            min-w-0
          ">
            {/* 上傳內容容器 */}
            <div className="
              w-full 
              h-full 
              flex 
              items-center 
              pl-5 
              pr-4 
              gap-3
            ">
              {/* Upload Icon 容器 */}
              <div className="flex-shrink-0">
                <FontAwesomeIcon 
                  icon={faArrowUpFromBracket} 
                  className="w-4 h-4 text-icon-primary" 
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
                  請上傳圖片
                </span>
              </div>
            </div>
          </div>

          {/* 上傳按鈕區域 */}
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
                上傳
              </span>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}