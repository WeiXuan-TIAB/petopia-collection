'use client'
import { useState, useEffect } from 'react';
import { FaThumbsUp, FaThumbsDown, FaComment, FaPen } from 'react-icons/fa6';
import ThreedotsMenu from './threedots-menu';

export default function InteractBar({
  size = 'normal',
  showComment = false,
  onCommentClick,
  targetId,        // 👈 目標ID（文章ID或留言ID）
  targetType,      // 👈 目標類型（'blog' 或 'comment'）
  currentUser,     // 👈 當前用戶
  articleAuthorId, // 👈 新增：文章作者ID
  commentOwnerId,   // 👈 新增：留言者ID
  onEdit,          //編輯留言
  onShare,        //threedots 
  onReport,       //threedots
}) {
  const [stats, setStats] = useState({ like: 0, dislike: 0 });
  const [userInteraction, setUserInteraction] = useState(null);
  const [loading, setLoading] = useState(false);

  const sizeConfig = {
    normal: {
      height: 'h-10',
      buttonSize: 'w-10 h-10', // 👈 修正：確保正圓
      iconSize: 24,
      spacing: 'ml-8'
    },
    small: {
      height: 'h-4',
      buttonSize: 'w-4 h-4',
      iconSize: 10,
      spacing: 'ml-4',
    }
  };

  const config = sizeConfig[size];

  // 👈 新增：判斷是否為內容擁有者
  const isContentOwner = targetType === 'blog'
    ? currentUser?.id === articleAuthorId    // 文章：判斷是否為文章作者
    : currentUser?.id === commentOwnerId;    // 留言：判斷是否為留言者

  // 載入互動統計和用戶狀態
  useEffect(() => {
    const fetchInteractionData = async () => {
      if (!targetId || !targetType) return;

      try {
        // 載入統計
        const statsResponse = await fetch(`http://localhost:3005/api/forum/${targetType}/${targetId}/stats`);
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats(statsData.data.stats);
        }

        // 載入用戶互動狀態（需要登入）
        if (currentUser) {
          const userResponse = await fetch(`http://localhost:3005/api/forum/${targetType}/${targetId}/user-interaction`, {
            credentials: 'include'
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUserInteraction(userData.data.interaction);
          }
        }
      } catch (error) {
        console.error('載入互動資料失敗:', error);
      }
    };

    fetchInteractionData();
  }, [targetId, targetType, currentUser]);

  // 處理按讚/倒讚點擊
  const handleInteraction = async (interactionType) => {
    if (!currentUser) {
      alert('請先登入');
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3005/api/forum/${targetType}/${targetId}/interact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ interactionType })
      });

      if (response.ok) {
        const data = await response.json();
        // 更新統計和用戶狀態
        setStats(data.data.stats);
        setUserInteraction(data.data.userInteraction);
      } else {
        console.error('互動失敗:', response.status);
      }
    } catch (error) {
      console.error('互動請求失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  // 判斷按鈕是否為活躍狀態
  const isLikeActive = userInteraction?.interaction_type === 'like';
  const isDislikeActive = userInteraction?.interaction_type === 'dislike';

  // 👈 提供預設函數
  const handleShare = onShare || (() => {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return;
    }
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      alert('網址已複製到剪貼板！');
    }).catch(() => {
      alert('複製失敗，請手動複製網址');
    });
  });



  const handleReport = onReport || (() => {
    alert('已反應至管理員處理，請靜候回覆');
  });

  return (
    <div className={`flex ${config.height} items-center self-stretch w-full justify-between`}>
      <div className='flex items-center'>
        {/* 按讚按鈕 */}
        <button
          onClick={() => handleInteraction('like')}
          className={`flex ${config.buttonSize} px-2 py-2 justify-center items-center gap-2.5 flex-shrink-0 aspect-square rounded-full border cursor-pointer relative
          ${isLikeActive
              ? 'border-orange-500 bg-orange-500 hover:bg-orange-600'
              : 'border-orange-500 bg-transparent hover:bg-orange-50'
            }
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        >
          <FaThumbsUp
            size={config.iconSize}
            className={`flex-shrink-0 ${isLikeActive ? 'text-white' : 'text-orange-500'}`}
          />
          {/* 數量顯示 */}
          {stats.like > 0 && (
            <span
              className={`absolute -top-2 -right-2 text-xs px-1 py-1 rounded-full min-w-[20px] text-center font-medium
    ${isLikeActive ? 'bg-orange-600 text-white' : 'bg-white border border-orange-400 text-orange-600'}
  `}
              style={{
                fontSize: size === 'small' ? '10px' : '12px',
                lineHeight: '1',
                fontWeight: '600',
                right: size === 'small' ? '-16px' : '-16px'
              }}
            >
              {stats.like}
            </span>
          )}
        </button>

        {/* 倒讚按鈕 - 內容擁有者隱藏 */}
        {!isContentOwner && (
          <button
            onClick={() => handleInteraction('dislike')}
            className={`flex ${config.buttonSize} px-2 py-2 justify-center items-center gap-2.5 flex-shrink-0 aspect-square rounded-full border ${config.spacing} cursor-pointer relative
            ${isDislikeActive
                ? 'border-brand-warm bg-brand-warm hover:bg-red-600'
                : 'border-brand-warm bg-transparent hover:bg-red-50'
              }
            ${loading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          >
            <FaThumbsDown
              size={config.iconSize}
              className={`flex-shrink-0 ${isDislikeActive ? 'text-white' : 'text-brand-warm'}`}
            />
            {/* 數量顯示 */}
            {stats.dislike > 0 && (
              <span
                className={`absolute -top-2 -right-2 text-xs px-1 py-1 rounded-full min-w-[20px] text-center font-medium
                ${isDislikeActive ? 'bg-red-600 text-white' : 'bg-red-100 text-red-600'}
              `}
                style={{
                  fontSize: size === 'small' ? '10px' : '12px',
                  lineHeight: '1',
                  fontWeight: '600',
                  right: size === 'small' ? '-16px' : '-16px'
                }}
              >
                {stats.dislike}
              </span>
            )}
          </button>
        )}

        {/* 留言按鈕 - 只在 small size 且 showComment 為 true 時顯示 */}
        {size === 'small' && showComment && (
          <button
            onClick={onCommentClick}
            className={`flex ${config.buttonSize} px-2 py-2 justify-center items-center gap-2.5 flex-shrink-0 aspect-square rounded-full border border-text-commentbtn bg-transparent ${config.spacing} cursor-pointer hover:bg-blue-50`}
          >
            <FaComment
              size={config.iconSize}
              className="flex-shrink-0 text-text-commentbtn"
            />
          </button>
        )}
      </div>

      {/* 👈 修改：根據條件顯示不同的右側按鈕 */}
      {targetType === 'comment' && isContentOwner ? (
        // 小 bar + 是留言者：顯示筆圖示
        <button
          onClick={onEdit}
          className={`flex ${config.buttonSize} px-2 py-2 justify-center items-center gap-2.5 flex-shrink-0 aspect-square rounded-full border border-brand-warm bg-transparent cursor-pointer hover:bg-gray-50`}
        >
          <FaPen
            size={config.iconSize}
            className="flex-shrink-0 text-brand-warm"
          />
        </button>
      ) : targetType === 'blog' ? (
        // 大 bar：顯示三點選單
        <ThreedotsMenu
          isContentOwner={isContentOwner}
          onShare={handleShare}
          articleId={targetId}
          onReport={handleReport}
          buttonSize={config.buttonSize}
          iconSize={config.iconSize}
        />
      ) : null}
    </div>
  );
}