'use client'
export default function MemberCard({ 
    avatarUrl = "imgurl", 
    username = "user_name" 
  }) {
    return (
      <div className="flex w-[166px] flex-col items-center gap-3">
        {/* 頭像框 */}
        <div 
          className="w-[145px] h-[145px] rounded-full bg-gray-300 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${avatarUrl})`
          }}
        />
        
        {/* 文字外框 */}
        <div className="flex py-3 px-[18px] justify-center items-center self-stretch rounded-[20px] bg-orange-300">
          {/* 文字框 */}
          <span 
            className="text-white text-center text-xl font-medium tracking-wide"
            style={{
              fontFamily: 'FakePearl, sans-serif',
              fontSize: '20px',
              fontWeight: 500,
              letterSpacing: '1px'
            }}
          >
            {username}
          </span>
        </div>
      </div>
    );
  }