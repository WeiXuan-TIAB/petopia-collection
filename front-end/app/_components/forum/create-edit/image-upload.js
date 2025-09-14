'use client'
import { useState } from 'react';
import { FaImage } from 'react-icons/fa6';
import Image from 'next/image';

export default function ImageUpload({
  onImageChange = () => { },
  label = "上傳創作縮圖",
  initialImageUrl = null // 👈 新增：用於編輯模式顯示現有圖片
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(initialImageUrl);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];

    if (file) {
      // 建立預覽 URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setSelectedFile(file);

      // 傳遞檔案給父組件
      onImageChange(file);

    }
  };

  const handleUploadClick = () => {
    document.getElementById('image-upload-input').click();
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    onImageChange(null);

    // 清除 input
    const input = document.getElementById('image-upload-input');
    if (input) input.value = '';
  };

  return (
    <div className="flex w-[284px] flex-col items-start gap-6">
      {/* 文字框 */}
      <div
        className="self-stretch text-[#3E2E2E]"
        style={{
          fontFamily: 'FakePearl, sans-serif',
          fontSize: '20px',
          fontWeight: 400,
          lineHeight: '150%'
        }}
      >
        {label}
      </div>

      {/* 圖片框 */}
      <div className="h-[284px] self-stretch aspect-square rounded-3xl bg-white border-2 border-dashed border-gray-300 flex items-center justify-center relative">
        {previewUrl ? (
          <div className="w-full h-full rounded-3xl overflow-hidden relative">
            <Image
              src={previewUrl}
              alt="上傳的圖片"
              className="w-full h-full object-cover"
            />
            {/* 移除圖片按鈕 */}
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ) : (
          <button className="text-gray-400 text-center cursor-pointer" onClick={handleUploadClick}>
            <FaImage size={48} className="mx-auto mb-2" />
            <p>點擊上傳圖片</p>
          </button>
        )}
      </div>

      {/* 上傳圖片bar布局 */}
      <div className="flex items-center self-stretch h-10">
        {/* 左側框 */}
        <div className="flex py-2 px-6 items-center gap-2.5 flex-1 border border-orange-500 border-r-0 bg-white h-full"
          style={{
            borderRadius: '9999px 0 0 9999px'
          }}>
          <FaImage className="w-4 h-4 aspect-square text-orange-500" />
          <span className="text-gray-500 text-sm">
            {selectedFile ? `已選擇: ${selectedFile.name}` : '選擇圖片檔案'}
          </span>
        </div>

        {/* 右側按鈕 */}
        <button
          onClick={handleUploadClick}
          className="flex py-2 px-6 justify-center items-center gap-2.5 bg-orange-500 text-white border border-orange-500 border-l-0 h-full hover:bg-orange-600"
          style={{
            borderRadius: '0 9999px 9999px 0',
            fontFamily: 'FakePearl, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '150%'
          }}
        >
          上傳圖片
        </button>
      </div>

      {/* 隱藏的 file input */}
      <input
        id="image-upload-input"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}