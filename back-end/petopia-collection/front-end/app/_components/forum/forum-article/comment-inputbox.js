'use client'
import { useState, useEffect } from 'react'; // 👈 新增 useEffect

export default function CommentInputbox({
  forumId,           // 文章 ID（用於文章留言）
  avatarUrl = "https://images.pexels.com/photos/991831/pexels-photo-991831.jpeg",
  placeholder = "輸入內容（限制100字）...",
  maxLength = 100,
  initialContent = "",
  onCommentAdded,    // 文章留言成功回調
  onSubmit,          // 👈 新增：回覆提交回調
  onCancel           // 👈 新增：取消回覆回調
}) {
  // 👈 修正：統一使用 comment state，並用 initialContent 初始化
  const [comment, setComment] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 👈 新增：當 initialContent 變化時更新內容
  useEffect(() => {
    setComment(initialContent);
  }, [initialContent]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      setComment(value);
    }
  };

  // 👈 新增：處理回覆提交
  const handleReplySubmit = async () => {
    if (comment.trim() && !isSubmitting && onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(comment.trim());
        setComment(''); // 清空輸入框
      } catch (error) {
        console.error('回覆失敗:', error);
        alert('回覆失敗，請重試');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 原有的文章留言提交
  const handleCommentSubmit = async () => {
    if (comment.trim() && !isSubmitting && forumId) {
      setIsSubmitting(true);
      try {
        const response = await fetch(`http://localhost:3005/api/forum/${forumId}/comments`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ 
            content: comment.trim() 
          }),
          credentials: 'include'
        });
        
        if (response.ok) {
          // const result = await response.json();
          setComment(''); // 清空輸入框
          onCommentAdded?.(); // 通知父元件重新載入留言
          alert('留言發布成功！');
        } else {
          const error = await response.json();
          console.error('留言失敗:', error);
          alert('留言失敗，請重試');
        }
      } catch (error) {
        console.error('提交失敗:', error);
        alert('網路錯誤，請重試');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // 👈 新增：取消回覆
  const handleCancel = () => {
    setComment('');
    onCancel?.();
  };

  // 👈 新增：判斷是回覆模式還是留言模式
  const isReplyMode = !!onSubmit;
  const handleSubmit = isReplyMode ? handleReplySubmit : handleCommentSubmit;

  return (
    <div className="flex items-center gap-3 self-stretch">
      {/* 左邊頭像框 */}
      <div 
        className="w-20 h-20 aspect-square rounded-full bg-gray-300 bg-cover bg-center bg-no-repeat flex-shrink-0"
        style={{
          backgroundImage: `url(${avatarUrl})`
        }}
      />
      
      {/* 右邊留言框 */}
      <div className="flex flex-col items-start flex-1">
        <div className="flex h-20 flex-col items-start flex-1 self-stretch rounded-2xl border-2 border-orange-500 bg-white relative">
          <textarea
            value={comment}
            onChange={handleInputChange}
            placeholder={placeholder}
            disabled={isSubmitting}
            className="w-full h-full p-3 resize-none border-0 rounded-2xl bg-transparent outline-none placeholder-orange-300 text-orange-500 text-xs font-light leading-4 disabled:opacity-50"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: '14px',
              fontWeight: 300,
              lineHeight: '16px'
            }}
          />
          
          {/* 字數計數器 */}
          <div className="absolute bottom-2 right-3 text-xs text-orange-300">
            {comment.length}/{maxLength}
          </div>
        </div>
        
        {/* 按鈕區域 */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={handleSubmit}
            disabled={!comment.trim() || isSubmitting || (!forumId && !isReplyMode)}
            className="px-4 py-2 bg-orange-500 text-white text-xs rounded-full disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-orange-600 transition-colors"
          >
            {isSubmitting ? '發送中...' : (isReplyMode ? '回覆' : '發送留言')}
          </button>
          
          {/* 👈 新增：回覆模式下顯示取消按鈕 */}
          {isReplyMode && (
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-4 py-2 bg-gray-300 text-gray-700 text-xs rounded-full hover:bg-gray-400 transition-colors disabled:cursor-not-allowed"
            >
              取消
            </button>
          )}
        </div>
      </div>
    </div>
  );
}