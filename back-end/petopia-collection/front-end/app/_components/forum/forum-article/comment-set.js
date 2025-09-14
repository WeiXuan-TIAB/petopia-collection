'use client'
import { useState } from 'react'
import {
  FaTrash,
  FaCircleExclamation,
} from 'react-icons/fa6'
import InteractBar from './interact-bar'
import CommentInputBox from './comment-inputbox'

export default function CommentSet({
  comment,
  currentUser,
  articleAuthorId,
  onUpdateComment,
  onDeleteComment,
}) {
  const [showReplyBox, setShowReplyBox] = useState(false)
  
  // 先取得 comment 資料
  const { id, content, members, member_id, level = 1, replies = [] } = comment
  
  // 再宣告需要用到 content 的 state
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)

  const avatarUrl = members?.avatar
    ? `http://localhost:3005${members.avatar}`
    : 'https://images.pexels.com/photos/991831/pexels-photo-991831.jpeg'

  const username = members?.name || members?.nickname || '匿名用戶'
  const isAuthor = members?.id === articleAuthorId
  const canDelete = currentUser?.id === member_id

  // 刪除留言處理函數
  const handleDelete = async () => {
    if (!window.confirm('確定刪除此留言?')) {
      return
    }

    try {
      await onDeleteComment(id)
      alert('留言已刪除')
    } catch (error) {
      console.error('刪除未成功', error)
      alert('請稍後再試試!')
    }
  }

  // 👈 檢舉留言處理函數
  const handleReport = () => {
    const confirmReport = window.confirm(
      `確定要檢舉這則留言嗎？\n\n留言內容：${content.substring(0, 50)}${content.length > 50 ? '...' : ''}`
    );
    
    if (confirmReport) {
      // 這裡之後可以接檢舉 API
      alert('已送出檢舉，我們會盡快處理。謝謝您的回報！');
      
      // 未來可以這樣實作：
      // try {
      //   const response = await fetch(`http://localhost:3005/api/forum/comments/${id}/report`, {
      //     method: 'POST',
      //     headers: { 'Content-Type': 'application/json' },
      //     credentials: 'include',
      //     body: JSON.stringify({ 
      //       reason: 'inappropriate_content',  // 檢舉原因
      //       description: '用戶檢舉此留言內容不當' 
      //     }),
      //   });
      //   
      //   if (response.ok) {
      //     alert('檢舉已送出，謝謝您的回報！');
      //   } else {
      //     alert('檢舉送出失敗，請稍後再試');
      //   }
      // } catch (error) {
      //   console.error('檢舉失敗:', error);
      //   alert('檢舉送出失敗，請稍後再試');
      // }
    }
  }

  // 編輯相關函數
  const handleEdit = () => {
    setIsEditing(true)
    setEditContent(content)
    console.log(editContent)
  }

  const handleEditSubmit = async (newContent) => {
    try {
      const response = await fetch(`http://localhost:3005/api/forum/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content: newContent }),
      })

      if (response.ok) {
        setIsEditing(false)
        setTimeout(()=>{onUpdateComment?.();},200)
        //temp
        alert('留言編輯成功！');
      } else {
        alert('編輯失敗，請稍後再試')
      }
    } catch (error) {
      console.error('編輯失敗:', error)
      alert('編輯失敗，請稍後再試')
    }
  }

  const handleEditCancel = () => {
    setIsEditing(false)
    setEditContent(content)
  }

  // 處理回覆按鈕點擊
  const handleCommentClick = () => {
    if (level >= 2) {
      alert('留言最多只能回覆到第二層')
      return
    }
    setShowReplyBox(!showReplyBox)
  }

  // 處理回覆提交
  const handleReplySubmit = async (replyContent) => {
    try {
      const response = await fetch(
        `http://localhost:3005/api/forum/comments/${id}/reply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            content: replyContent,
          }),
        }
      )

      if (response.ok) {
        setShowReplyBox(false)
        onUpdateComment?.();
      } else {
        console.error('回覆失敗:', response.status)
        alert('回覆失敗，請稍後再試')
      }
    } catch (error) {
      console.error('回覆失敗:', error)
      alert('回覆失敗，請稍後再試')
    }
  }

  // 根據層級決定樣式
  const containerClass =
    level === 2 ? 'ml-[69px] bg-gray-50 p-3 rounded-lg' : ''

  return (
    <div className={`flex flex-col gap-[21px] ${containerClass}`}>
      {/* 留言內容 */}
      <div className="flex items-start gap-[21px]">
        {/* 頭像 */}
        <div
          className="w-16 h-16 aspect-square rounded-full bg-gray-300 bg-cover bg-center bg-no-repeat flex-shrink-0"
          style={{
            backgroundImage: `url(${avatarUrl})`,
          }}
        />

        {/* 文字框 + InteractBar */}
        <div className="flex flex-1 flex-col items-start gap-[21px]">
          {/* 條件渲染留言內容 */}
          {isEditing ? (
            // 編輯模式：顯示輸入框
            <div className="w-full">
              <CommentInputBox
                placeholder="編輯留言..."
                maxLength={100}
                initialContent={content}
                onSubmit={handleEditSubmit}
                onCancel={handleEditCancel}
                avatarUrl={avatarUrl}
              />
            </div>
          ) : (
            // 一般模式：顯示原本的留言內容
            <div className="flex items-center gap-[11px] self-stretch">
              {/* 留言者名稱 + 作者標籤 */}
              <div className="flex items-center gap-2">
                <span
                  className="text-green-600 text-center flex-shrink-0"
                  style={{
                    fontFamily: 'FakePearl, sans-serif',
                    fontSize: '16px',
                    fontWeight: 300,
                    lineHeight: '20px',
                  }}
                >
                  {username}
                </span>

                {isAuthor && (
                  <span
                    className="px-2 py-1 bg-green-500 text-white text-xs rounded-full flex-shrink-0"
                    style={{
                      fontFamily: 'FakePearl, sans-serif',
                      fontSize: '12px',
                      fontWeight: 400,
                      lineHeight: '12px',
                    }}
                  >
                    作者
                  </span>
                )}
              </div>
              
              {/* 留言內容 */}
              <div
                className="flex-1 text-text-primary"
                style={{
                  fontFamily: 'FakePearl, sans-serif',
                  fontSize: '16px',
                  fontWeight: 300,
                  lineHeight: '20px',
                }}
              >
                {content}
              </div>
              
              {/* 👈 刪除/檢舉按鈕 - 這是今天實作的重點功能 */}
              {canDelete ? (
                // 留言者：顯示刪除按鈕
                <button
                  onClick={handleDelete}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  title="刪除留言"
                >
                  <FaTrash size={12} />
                </button>
              ) : currentUser && (
                // 非留言者但有登入：顯示檢舉按鈕
                <button
                  onClick={handleReport}
                  className="p-1 text-gray-400 hover:text-orange-500 transition-colors flex-shrink-0"
                  title="檢舉留言"
                >
                  <FaCircleExclamation size={12} />
                </button>
              )}
            </div>
          )}

          {/* 只有第一層留言且非編輯模式才顯示回覆按鈕 */}
          {level === 1 && currentUser && !isEditing && (
            <InteractBar
              size="small"
              showComment={true}
              onCommentClick={handleCommentClick}
              targetId={id}
              targetType="comment"
              currentUser={currentUser}
              onDeleteComment={onDeleteComment}
              commentOwnerId={member_id}
              onEdit={handleEdit}
            />
          )}
        </div>
      </div>

      {/* 回覆框 */}
      {showReplyBox && currentUser && (
        <div className="pl-[69px]">
          <CommentInputBox
            placeholder="回覆..."
            maxLength={100}
            onSubmit={handleReplySubmit}
            onCancel={() => setShowReplyBox(false)}
            avatarUrl={
              currentUser?.avatar
                ? `http://localhost:3005${currentUser.avatar}`
                : 'https://images.pexels.com/photos/991831/pexels-photo-991831.jpeg'
            }
          />
        </div>
      )}

      {/* 顯示第二層回覆 */}
      {replies && replies.length > 0 && (
        <div className="mt-4">
          {replies.map((reply) => (
            <CommentSet
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              articleAuthorId={articleAuthorId}
              onDeleteComment={onDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  )
}