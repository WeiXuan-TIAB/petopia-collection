'use client'
import { useState, useEffect } from 'react'
import { Editor } from '@tinymce/tinymce-react'

export default function RichTextEditor({
  value = '',
  onChange = () => {},
  placeholder = '請輸入內容...',
  maxLength = 500,
  label = "內容"
}) {
  const [editorValue, setEditorValue] = useState(value)
  const [textLength, setTextLength] = useState(0)

  // 當外部 value 改變時更新編輯器內容
  useEffect(() => {
    setEditorValue(value)
    // 計算純文字長度（去除 HTML 標籤和 iframe）
    const textOnly = value.replace(/<[^>]*>/g, '')
    setTextLength(textOnly.length)
  }, [value])

  // 提取 YouTube 影片 ID（支援 Shorts）
  const extractYouTubeId = (url) => {
    // 支援多種 YouTube URL 格式，包括 Shorts
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/v\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/
    ]
    
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match && match[1]) {
        return match[1]
      }
    }

    return null
  }

  // 自定義插件：YouTube 按鈕
  const setupYouTubePlugin = (editor) => {
    if (!editor.ui.registry.getAll().buttons.youtube) {
      editor.ui.registry.addButton('youtube', {
        text: '🎥',
        tooltip: '插入 YouTube 影片',
        onAction: () => {
          editor.windowManager.open({
            title: '插入 YouTube 影片',
            body: {
              type: 'panel',
              items: [
                {
                  type: 'input',
                  name: 'url',
                  label: 'YouTube 影片連結',
                  placeholder: '請貼上 YouTube 影片連結...'
                }
              ]
            },
            buttons: [
              {
                type: 'cancel',
                text: '取消'
              },
              {
                type: 'submit',
                text: '插入',
                primary: true
              }
            ],
            onSubmit: (api) => {
              const data = api.getData()
              
              if (!data.url || data.url.trim() === '') {
                editor.windowManager.alert('請輸入 YouTube 連結')
                return
              }
              
              const videoId = extractYouTubeId(data.url.trim())
              
              if (videoId) {
                const iframe = `<p><iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="max-width: 100%; margin: 10px auto; display: block;"></iframe></p>`
                editor.insertContent(iframe)
                api.close()
              } else {
                editor.windowManager.alert('請輸入有效的 YouTube 連結\n\n支援格式：\n• https://youtube.com/watch?v=...\n• https://youtu.be/...\n• https://youtube.com/shorts/...')
              }
            }
          })
        }
      })
    }
  }

  const handleEditorChange = (content) => {
    // 計算純文字長度（排除 HTML 標籤）
    const textOnly = content.replace(/<[^>]*>/g, '')
    
    // 檢查字數限制
    if (textOnly.length <= maxLength) {
      setEditorValue(content)
      setTextLength(textOnly.length)
      onChange(content)
    }
  }


  return (
    <div className="w-full">
      {/* 標題 */}
      <label 
        className="block text-xl mb-2 text-[#3E2E2E]"
        style={{
          fontFamily: 'FakePearl, sans-serif',
          fontSize: '20px',
          fontWeight: 400,
          lineHeight: '150%'
        }}
      >
        {label}
      </label>

      {/* TinyMCE 編輯器 */}
      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <Editor
          apiKey="vws3elm1xcmq0rvlmqzvkwcshfnz2fl32aoz38yxx76mjpg3"
          value={editorValue}
          onEditorChange={handleEditorChange}
          init={{
            height: 300,
            menubar: false,
            plugins: [
              'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
              'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
              'insertdatetime', 'media', 'table', 'help', 'wordcount'
            ],
            toolbar: 'undo redo | blocks | ' +
              'bold italic forecolor backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'image link youtube | removeformat | help',
            content_style: `
              body { 
                font-family: 'FakePearl', sans-serif; 
                font-size: 14px; 
                line-height: 1.5;
              }
              img { 
                max-width: 600px !important; 
                width: auto !important; 
                height: auto !important; 
                display: block !important; 
                margin: 10px auto !important; 
                object-fit: contain !important;
              }
              iframe {
                max-width: 100% !important;
                width: 100% !important;
                height: auto !important;
                aspect-ratio: 16/9 !important;
                margin: 10px auto !important;
                display: block !important;
                border-radius: 8px !important;
              }
            `,
            placeholder: placeholder,
            
            // 設置自定義插件
            setup: setupYouTubePlugin,
            
            // 🔥 只用這個檔案上傳處理器
            images_upload_handler:async (blobInfo) => {
  try {
    const formData = new FormData();
    formData.append('image', blobInfo.blob(), blobInfo.filename());
    
    const response = await fetch('/api/forum/upload-image', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    return result.location;
  } catch (error) {
    console.error('❌ 上傳錯誤:', error);
    throw error;
  }
},
            
            // 圖片設定
            image_advtab: true,
            image_caption: true,
            
            // 允許 iframe 標籤
            extended_valid_elements: 'iframe[src|frameborder|style|scrolling|class|width|height|name|align|allowfullscreen|allow]',
            valid_children: '+body[iframe]',
            
            // 限制貼上
            paste_data_images: true,
            
            // 語言設定
            language: 'zh-TW',
            
            // 移除品牌標識
            branding: false,
            
            // 自定義樣式
            skin: 'oxide',
            content_css: 'default'
          }}
        />
      </div>

      {/* 功能說明 */}
      <div className="flex justify-between items-center mt-2 text-sm">
        <div className="text-gray-500">
          支援粗體、斜體、顏色、清單、圖片插入、YouTube影片 📷🎥
        </div>
        <div className={`${textLength > maxLength * 0.9 ? 'text-red-500' : 'text-gray-500'}`}>
          {textLength}/{maxLength} 字
        </div>
      </div>

      {/* 字數超限警告 */}
      {textLength > maxLength && (
        <div className="mt-1 text-red-500 text-sm">
          ⚠️ 內容超出字數限制，請刪減部分文字
        </div>
      )}
    </div>
  )
}
