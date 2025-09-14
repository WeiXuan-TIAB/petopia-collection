'use client'
import { useState, useEffect,useCallback } from 'react'
import { useParams } from 'next/navigation'
import '@/styles/globals.css'
import MemberCard from '@/app/_components/forum/forum-article/membercard'
import TitleHashtag from '@/app/_components/forum/forum-article/title-hashtag'
import ImageTextBlock from '@/app/_components/forum/forum-article/image-text-block'
import InteractBar from '@/app/_components/forum/forum-article/interact-bar'
import CommentArea from '@/app/_components/forum/forum-article/comment-area'
import CommentInputbox from '@/app/_components/forum/forum-article/comment-inputbox'

//文章時間
const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function ForumPage() {
  const params = useParams()
  const [article, setArticle] = useState(null)
  const [memberData, setMemberData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  // 留言相關狀態
  const [comments, setComments] = useState([])
  const [commentsLoading, setCommentsLoading] = useState(false)

  // 載入留言的函數
const fetchComments = useCallback(async () => {
  try {
    const response = await fetch(`http://localhost:3005/api/forum/${params.id}/comments`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    setCommentsLoading(true)
    const data = await response.json()
    setComments(data.comments || [])
  } catch (err) {
    console.error('❌ 獲取留言失敗:', err)
    setComments([])
  }
}, [params.id]) 

  // 留言提交成功後的回調
  const handleCommentAdded = () => {
    fetchComments() // 重新載入留言
  }

  //刪除留言
  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/forum/comments/${commentId}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )
      if (response.ok) {
        //重取留言或更新狀態
        fetchComments()
        alert('回不去了!')
        } else {
      // 加上這個
      console.error('刪除失敗:', response.status)
      alert('刪除失敗！')
    }
  } catch (error) {
    console.error('刪除未成功', error)
    alert('刪除失敗！') // 加上這個
  }
}
  // 串API開始!
// 抽到外面，避免每次 useEffect 重建
const fetchMemberData = async (memberId) => {
  try {
    const response = await fetch(`http://localhost:3005/api/members/${memberId}`)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

    const memberResponse = await response.json()
    const member =
      memberResponse.data?.member || memberResponse.member || memberResponse

    setMemberData(member)
  } catch (err) {
    console.error('❌ 獲取會員資料失敗:', err)
    setMemberData({
      username: '未知使用者',
      avatar: null,
    })
  }
}

useEffect(() => {
  const fetchArticle = async () => {
    try {
      const response = await fetch(`http://localhost:3005/api/forum/${params.id}`)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)

      const data = await response.json()
      const forum = data.data?.forum || data.forum
      setArticle(forum)

      const authorId = forum?.member_id || forum?.user_id || forum?.author_id
      if (authorId) {
        fetchMemberData(authorId)
      } else {
        console.error('會員資料錯誤: 找不到 authorId')
      }
    } catch (err) {
      console.error('API 請求失敗:', err)
      setError(err.message) 
    } finally {
      setLoading(false)
    }
  }

  if (params.id) {
    fetchArticle()
    fetchComments() // 同時載入留言
  }
}, [params.id, fetchComments])

  //Comment頭像框
  const [currentUser, setCurrentUser] = useState(null)
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:3005/api/auth/check', {
          credentials: 'include',
        })
        if (response.ok) {
          const userData = await response.json()
          setCurrentUser(userData.data?.user || userData.user)
        }
      } catch (error) {
        console.error('取得用戶資料失敗:', error)
      }
    }

    fetchCurrentUser()
  }, [])

  if (loading) {
    return <div className="container pt-8 px-32">載入中...</div>
  }

  if (error) {
    return <div className="container pt-8 px-32">錯誤: {error}</div>
  }

  if (!article) {
    return <div className="container pt-8 px-32">找不到文章</div>
  }

  // 🎯 智能富文本解析函數（保持格式的版本）
  const parseQuillContent = (htmlContent) => {
    if (!htmlContent) return []

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(htmlContent, 'text/html')
      const elements = Array.from(doc.body.children)
      const parsedContent = []

      elements.forEach((element) => {
        // 🎯 檢查是否包含媒體元素
        const iframes = element.querySelectorAll('iframe')
        const images = element.querySelectorAll('img')
        
        // 🎯 特殊處理：影片元素（單獨渲染）
        if (iframes.length > 0) {
          iframes.forEach((iframe) => {
            parsedContent.push({
              type: 'video',
              content: iframe.src,
              width: iframe.getAttribute('width') || '560',
              height: iframe.getAttribute('height') || '315',
            })
          })
          
          // 檢查是否還有文字內容（移除 iframe 後）
          let remainingHTML = element.innerHTML
          remainingHTML = remainingHTML.replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
          if (remainingHTML.trim() && remainingHTML.trim() !== '&nbsp;') {
            parsedContent.push({
              type: 'html',
              content: remainingHTML.trim(),
            })
          }
          return
        }

        // 🎯 特殊處理：圖片段落的強化判斷
        if (images.length > 0) {
          let textContentTest = element.innerHTML
          
          // 移除所有圖片標籤
          textContentTest = textContentTest.replace(/<img[^>]*>/gi, '')
          // 移除常見的空白字符
          textContentTest = textContentTest.replace(/&nbsp;/g, '')
          textContentTest = textContentTest.replace(/\s+/g, '')
          textContentTest = textContentTest.replace(/<br\s*\/?>/gi, '')
          textContentTest = textContentTest.trim()
                    
          // 如果段落只有圖片，沒有文字內容
          if (!textContentTest) {
            images.forEach((img) => {
              parsedContent.push({
                type: 'image',
                content: img.src,
              })
            })
            return // 重要：找到圖片後直接返回，不繼續處理
          } else {
              console.error('圖片段落處理錯誤:', error)
          }
        }

        // 🎯 標題處理
        if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
          const htmlContent = element.innerHTML
          if (htmlContent.trim()) {
            parsedContent.push({
              type: 'heading',
              content: htmlContent.trim(),
              level: element.tagName.toLowerCase(),
            })
          }
          return
        }

        // 🎯 默認處理：保持原始 HTML 格式（包含所有富文本格式）
        if (element.tagName === 'P' || element.tagName === 'DIV') {
          const htmlContent = element.innerHTML.trim()
          if (htmlContent && htmlContent !== '&nbsp;') {
            parsedContent.push({
              type: 'html',
              content: htmlContent,
            })
          }
        }
      })
      return parsedContent
    } catch (error) {
      console.error('解析內容失敗:', error)
      return [{ type: 'html', content: htmlContent }]
    }
  }

  //解析quill
  const parsedContent = parseQuillContent(article?.content)

  return (
    <div className="container pt-8 px-32 bg-[#FEF1EA]">
      <div className="flex items-start gap-[85px] self-stretch pb-12 w-5/6">
        {/* 左側：會員框 */}
        <div className="flex-shrink-0">
          <MemberCard
            avatarUrl={
              memberData?.avatar
                ? `http://localhost:3005${memberData.avatar}`
                : 'https://images.pexels.com/photos/33245246/pexels-photo-33245246.jpeg'
            }
            username={memberData?.nickname || memberData?.name || '載入中...'}
          />
        </div>

        {/* 右側：標題+按鈕組 和 圖文組 垂直排列 */}
        <div className="flex-1 flex flex-col items-stretch gap-12">
          {/* 標題+按鈕組 */}
          <TitleHashtag
            title={article.title || '載入中...'}
            hashtags={article.hashtags || []}
          />

          {/* 文章時間 */}
           <div className="text-gray-500 text-sm mb-4">
            <span>發布時間: {formatDate(article.created_at)}</span>
            {article.updated_at && article.updated_at !== article.created_at && (
              <span className="ml-4">
                編輯時間: {formatDate(article.updated_at)}
              </span>
            )}
          </div>

          {/* 圖文影音組 - 支援圖片、文字、影片、標題 */}
          <div className="flex flex-col gap-12">
            {parsedContent.length > 0 ? (
              parsedContent.map((block, index) => {
                // 🎯 標題渲染
                if (block.type === 'heading') {
                  const HeadingTag = block.level
                  const fontSize = {
                    h1: '32px',
                    h2: '28px',
                    h3: '24px',
                    h4: '20px',
                    h5: '18px',
                    h6: '16px',
                  }[block.level] || '24px'

                  return (
                    <div key={`heading-${index}`} className="w-full text-black">
                      <HeadingTag
                        style={{
                          fontFamily: 'FakePearl, sans-serif',
                          fontSize: fontSize,
                          fontWeight: 'bold',
                          lineHeight: '120%',
                          marginBottom: '20px',
                        }}
                        dangerouslySetInnerHTML={{ __html: block.content }}
                      />
                    </div>
                  )
                }

                // 🎯 影片渲染
                if (block.type === 'video') {
                  return (
                    <div
                      key={`video-${index}`}
                      className="flex flex-col items-start gap-12 self-stretch"
                    >
                      <div className="w-full self-stretch">
                        <div className="w-full rounded-[40px] overflow-hidden bg-black">
                          <iframe
                            src={block.content}
                            width="780"
                            height="440"
                            className="w-full h-auto"
                            style={{
                              aspectRatio: '780/440',
                              border: 'none',
                            }}
                            allowFullScreen
                            title={`影片-${index}`}
                            onLoad={() =>
                              console.log('✅ 影片 iframe 載入成功')
                            }
                            onError={(e) =>
                              console.error('❌ 影片 iframe 載入失敗:', e)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )
                }

                // 🎯 圖片渲染
                if (block.type === 'image') {
                  return (
                    <ImageTextBlock
                      key={`image-${index}`}
                      imageUrl={block.content}
                      text=""
                    />
                  )
                }

                // 🎯 富文本 HTML 渲染（保持所有格式）
                if (block.type === 'html') {
                  return (
                    <div 
                      key={`html-${index}`}
                      className="w-full prose prose-lg max-w-none"
                      style={{
                        fontFamily: 'FakePearl, sans-serif',
                        fontSize: '16px',
                        lineHeight: '1.6',
                        color: '#333'
                      }}
                      dangerouslySetInnerHTML={{ __html: block.content }}
                    />
                  )
                }

                // 🎯 純文字渲染（向後兼容）
                if (block.type === 'text') {
                  return (
                    <ImageTextBlock
                      key={`text-${index}`}
                      imageUrl=""
                      text={block.content}
                      isHTML={block.isHTML || false}
                    />
                  )
                }

                return null
              })
            ) : (
              <div className="text-gray-500">暫無內容</div>
            )}
          </div>
          <div className="w-full">
            <InteractBar
              size="normal"
              targetId={article?.id}
              targetType="blog"
              currentUser={currentUser}
              articleAuthorId={article?.member_id}
            />
          </div>
          <div className="flex flex-col items-start gap-[18px] py-8">
            {/* 修改：傳入真實留言資料和載入狀態 */}
            <CommentArea
              comments={comments}
              loading={commentsLoading}
              currentUser={currentUser} // 傳遞當前用戶
              articleAuthorId={article?.member_id} // 傳遞文章作者ID
              onUpdateComment={fetchComments} //更新留言
              onDeleteComment={handleDeleteComment} //刪留言
            />

            <div className="w-full self-start pt-6">
              {/* 修改：傳入 forumId 和回調函數 + 沒登入隱藏輸入框 */}
              {currentUser && (
                <CommentInputbox
                  forumId={params.id}
                  onCommentAdded={handleCommentAdded}
                  avatarUrl={
                    currentUser?.avatar // 👈 當前登入用戶的頭像
                      ? `http://localhost:3005${currentUser.avatar}`
                      : 'https://images.pexels.com/photos/33245246/pexels-photo-33245246.jpeg'
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}