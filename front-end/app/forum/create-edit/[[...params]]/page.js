'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import '@/styles/globals.css'
import ImageUpload from '@/app/_components/forum/create-edit/image-upload'
import SelectField from '@/app/_components/forum/create-edit/select-field'
import TextInput from '@/app/_components/forum/create-edit/text-input'
import HashtagSelector from '@/app/_components/forum/create-edit/hashtag-selector'
import PublishStatus from '@/app/_components/forum/create-edit/publish-status'
import AgreementCheckbox from '@/app/_components/forum/create-edit/agreement-checkbox'
import SubmitButton from '@/app/_components/forum/create-edit/submit-button'
import RichTextEditor from '@/app/_components/forum/create-edit/rich-text-editor'

export default function CreateEditPage({ params, searchParams }) {
  // 修正參數解析
  const id = searchParams?.id || params?.id // 從 query string 取得 id
  const mode = searchParams?.mode || (id ? 'edit' : 'create')
  const router = useRouter()

  // 表單狀態
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectedPet, setSelectedPet] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [publishStatus, setPublishStatus] = useState('draft')
  const [agreed, setAgreed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null) // 新增：圖片狀態
  const [initialImageUrl, setInitialImageUrl] = useState(null) //cover縮圖

  // API 函數 - 修改為後端服務器的完整 URL
  const API_BASE_URL = 'http://localhost:3005' // 你的後端 port

  const createPost = async (formData) => {
    try {
      const url = `${API_BASE_URL}/api/forum`
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      // 檢查回應類型
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text()
        console.error('非 JSON 回應:', textResponse)
        throw new Error(`伺服器回應格式錯誤 (${response.status})`)
      }

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || '建立文章失敗')
      }

      return response.json()
    } catch (error) {
      console.error('API 請求錯誤:', error)
      throw error
    }
  }

  const updatePost = async (forumId, formData) => {
    const response = await fetch(`${API_BASE_URL}/api/forum/${forumId}`, {
      method: 'PUT',
      body: formData,
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '更新文章失敗')
    }

    return response.json()
  }

  const getPost = async (forumId) => {
    const response = await fetch(`${API_BASE_URL}/api/forum/${forumId}`, {
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '載入文章失敗')
    }

    return response.json()
  }

  const deletePost = async (forumId) => {
    const response = await fetch(`${API_BASE_URL}/api/forum/${forumId}`, {
      method: 'DELETE',
      credentials: 'include',
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || '刪除文章失敗')
    }

    return response.json()
  }

  // 載入文章資料（編輯模式）
  useEffect(() => {
    if (id && mode === 'edit') {
      setIsLoading(true)

      getPost(id)
        .then((response) => {
          // 根據實際的 API 回應格式解析
          let forum
          if (response.data && response.data.forum) {
            forum = response.data.forum
          } else if (response.forum) {
            forum = response.forum
          } else if (response.id) {
            forum = response
          } else {
            throw new Error('無法解析 API 回應格式')
          }

          // 檢查必要欄位
          if (!forum || !forum.id) {
            throw new Error('文章資料不完整')
          }

          // 設定表單資料
          setTitle(forum.title || '')
          setContent(forum.content || '')

          // 對應前端的選項到後端的值
          const typeMapping = {
            text: '文字創作',
            blog: '圖片創作',
            vlog: '影片創作',
          }
          setSelectedType(typeMapping[forum.type] || '')

          // 寵物分類 👈 插入這裡
          setSelectedPet(forum.pet_category || '')

          // 👈 在這裡加入封面圖片設定
          const fullImageUrl = forum.image_url
            ? `http://localhost:3005${forum.image_url}`
            : null
          setInitialImageUrl(fullImageUrl)

          // 處理 hashtags
          if (Array.isArray(forum.hashtags)) {
            setSelectedTags(forum.hashtags)
          } else {
            setSelectedTags([])
          }
          setPublishStatus(forum.status || 'draft')
        })
        .catch((error) => {
          console.error('載入文章失敗:', error)
          alert(`載入文章失敗: ${error.message}`)
          router.push('/forum')
        })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [id, mode, router])

  // 準備表單資料
  const prepareFormData = () => {
    const formData = new FormData()

    // 基本欄位
    formData.append('title', title)
    formData.append('content', content)
    formData.append('status', publishStatus)
    //formData.append('hashtags', JSON.stringify(hashtags));

    // 對應前端選項到後端的值
    const typeMapping = {
      文字創作: 'text',
      圖片創作: 'blog', // 假設圖片也歸類為 blog
      影片創作: 'vlog',
    }
    formData.append('type', typeMapping[selectedType] || 'blog')

    // Hashtags - 確保是陣列格式
    const hashtagsArray = Array.isArray(selectedTags) ? selectedTags : []
    // @@@@@
    formData.append('hashtags', JSON.stringify(hashtagsArray))
    // 寵物分類 👈 插入這裡

    // 圖片（如果有的話）
    if (uploadedImage) {
      formData.append('image', uploadedImage)
    }

    return formData
  }

  // 建立文章
  const handleCreate = async () => {
    setIsLoading(true)

    try {
      // 驗證必填欄位
      if (!title || !content) {
        alert('請填寫標題和內容')
        return
      }

      if (!selectedType) {
        alert('請選擇創作類型')
        return
      }

      if (!agreed) {
        alert('請同意著作權授權')
        return
      }

      const formData = prepareFormData()
      const response = await createPost(formData)

      const newArticleId = response.data.forum.id
      alert('文章發布成功！')
      router.push(`/forum/article/${newArticleId}`)
    } catch (error) {
      console.error('發布失敗:', error)
      alert(`發布失敗: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 更新文章
  const handleUpdate = async () => {
    setIsLoading(true)

    try {
      // 驗證必填欄位
      if (!title || !content) {
        alert('請填寫標題和內容')
        return
      }

      if (!selectedType) {
        alert('請選擇創作類型')
        return
      }

      const formData = prepareFormData()
      const response = await updatePost(id, formData)
      console.log('更新成功:', response)
      alert('文章更新成功！')
      router.push(`/forum/article/${id}`)
    } catch (error) {
      console.error('更新失敗:', error)
      alert(`更新失敗: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // 刪除文章
  const handleDelete = async () => {
    if (!confirm('確定要刪除這篇文章嗎？')) {
      return
    }

    setIsLoading(true)

    try {
      await deletePost(id)
      alert('文章刪除成功！')
      router.push('/forum')
    } catch (error) {
      console.error('刪除失敗:', error)
      alert(`刪除失敗: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container pt-4 px-32 bg-[#FEF1EA]">
      <div className="flex py-32 flex-col items-start gap-6 self-stretch bg-[#FEF1EA]">
        {/* 標題區塊 */}
        <div className="flex py-6 flex-col items-start gap-[9px] self-stretch">
          <h1
            className="h-14 self-stretch text-orange-500 text-center"
            style={{
              fontFamily: 'FakePearl, sans-serif',
              fontSize: '64px',
              fontWeight: 400,
              lineHeight: '100%',
            }}
          >
            {mode === 'create' && '發表創作'}
            {mode === 'edit' && '編輯創作'}
            {mode === 'delete' && '刪除創作'}
          </h1>
        </div>

        {/* 載入中狀態 */}
        {isLoading && mode === 'edit' && (
          <div className="text-center py-8">
            <p>載入中...</p>
          </div>
        )}

        {/* 表單內容區塊 */}
        {(!isLoading || mode === 'create') && (
          <div className="flex flex-col px-24 gap-6 self-stretch">
            <ImageUpload
              onImageChange={setUploadedImage}
              initialImageUrl={initialImageUrl} //cover
              label="封面縮圖"
            />

            <SelectField
              label="創作類型"
              options={['文字創作', '圖片創作', '影片創作']}
              placeholder="請選擇創作類型"
              value={selectedType}
              onChange={setSelectedType}
            />

            <SelectField
              label="寵物分類"
              options={['貓貓', '狗狗', '特寵']}
              placeholder="請選擇寵物"
              value={selectedPet}
              onChange={setSelectedPet}
            />

            <TextInput
              label="標題"
              placeholder="請輸入標題，限制50字"
              value={title}
              onChange={setTitle}
              maxLength={50}
            />

            <RichTextEditor
              label="內容"
              placeholder="請輸入內容，僅字數為500字以內"
              value={content}
              onChange={setContent}
              maxLength={500}
            />

            <HashtagSelector
              label="Hashtag"
              hashtags={['聰明', '活潑', '可愛', '溫馴', '調皮']}
              selectedTags={selectedTags}
              onChange={setSelectedTags}
            />

            <PublishStatus
              label="發文狀態"
              value={publishStatus}
              onChange={setPublishStatus}
              placeholder="目前狀態"
            />

            {/* 邏輯判斷 */}
            {mode === 'create' && (
              <AgreementCheckbox checked={agreed} onChange={setAgreed} />
            )}

            {/* 按鈕區域 */}
            <div className="flex gap-4">
              {mode === 'create' && (
                <SubmitButton
                  text={isLoading ? '送出中...' : '送出'}
                  onClick={handleCreate}
                  disabled={isLoading}
                />
              )}

              {mode === 'edit' && (
                <>
                  <SubmitButton
                    text={isLoading ? '更新中...' : '更新'}
                    onClick={handleUpdate}
                    disabled={isLoading}
                  />
                  <SubmitButton
                    text={isLoading ? '刪除中...' : '刪除'}
                    variant="danger"
                    onClick={handleDelete}
                    disabled={isLoading}
                  />
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
