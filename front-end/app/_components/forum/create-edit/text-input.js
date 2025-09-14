'use client'

export default function TextInput({
    label = "標題",
    placeholder = "請輸入標題，限制50字",
    value = "",
    onChange = () => {},
    maxLength = 50,
    type = "text"
  }) {
    const handleInputChange = (event) => {
      onChange(event.target.value);
    };
  
    return (
      <div className="flex flex-col items-start gap-2 self-stretch">
        {/* 上文字 */}
        <label 
          className="text-[#3E2E2E]"
          style={{
            fontFamily: 'FakePearl, sans-serif',
            fontSize: '20px',
            fontWeight: 400,
            lineHeight: '150%'
          }}
        >
          {label}
        </label>
        
        {/* 下框 */}
        <div className="flex max-w-[400px] py-2 px-6 items-center gap-2.5 self-stretch rounded-full border border-orange-500 bg-white">
          {/* 框內輸入 */}
          <input
            type={type}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            maxLength={maxLength}
            className="flex-1 bg-transparent outline-none border-none"
            style={{
                fontFamily: 'FakePearl, sans-serif',
                fontSize: '16px',
                fontWeight: 400,
                lineHeight: '150%',
                color: '#3E2E2E'  // 固定深色，移除動態顏色
              }}
          />
        </div>
      </div>
    );
  }