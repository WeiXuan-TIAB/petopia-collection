'use client'
import { useState } from 'react';
import Image from 'next/image';

export default function ImageTextBlock({ 
    imageUrl = "", 
    text = "",
    isHTML = false
  }) {
    const [imageError, setImageError] = useState(false);

    const handleImageError = () => {
      setImageError(true);
      console.warn('圖片載入失敗:', imageUrl?.substring(0, 50) + '...');
    };

    return (
      <div className="flex flex-col items-start gap-12 self-stretch">
        {imageUrl && !imageError && (
          <div className="w-full">
            <Image 
              src={imageUrl} 
              alt="文章圖片" 
              className="w-full rounded-[60px] object-cover"
              style={{
                maxHeight: '600px',
                minHeight: '200px'
              }}
              onError={handleImageError}
              onLoad={() => console.log('✅ 圖片載入成功')}
            />
          </div>
        )}
        
        {imageError && (
          <div className="w-full h-48 bg-gray-200 rounded-[60px] flex items-center justify-center">
            <span className="text-gray-500">圖片載入失敗</span>
          </div>
        )}
        
        {text && (
          <div 
            className="w-full text-black text-left"
            style={{
              fontFamily: 'FakePearl, sans-serif',
              fontSize: '16px', // 修正：使用具體數值而非 'fp-body'
              fontWeight: 400,
              lineHeight: '150%'
            }}
          >
            {isHTML ? (
              <div 
                dangerouslySetInnerHTML={{ __html: text }}
                className="prose prose-lg max-w-none"
                style={{
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  lineHeight: 'inherit'
                }}
              />
            ) : (
              <p>{text}</p>
            )}
          </div>
        )}
      </div>
    );
  }