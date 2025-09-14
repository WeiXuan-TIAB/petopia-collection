'use client'

import CommentSet from './comment-set';

export default function CommentArea({
  comments = [],     // 👈 接收真實留言資料
  loading = false,    // 👈 接收載入狀態
  currentUser,  // 👈 新增：需要當前用戶資訊
  articleAuthorId,  // 👈 新增：文章作者ID
  onUpdateComment,//更新留言
  onDeleteComment,//刪留言
}) {


  // 模擬留言資料
  // const sampleComments = [
  //   {
  //     avatarUrl: "https://images.pexels.com/photos/991831/pexels-photo-991831.jpeg",
  //     username: "我愛毛孩",
  //     comment: "講得很清楚，尤其是動物性蛋白質段，對新手飼主真助很大！"
  //   },
  //   {
  //     avatarUrl: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
  //     username: "貓奴阿明",
  //     comment: "我家貓咪就是這樣養的，現在很健康呢～謝謝分享！"
  //   },
  //   {
  //     avatarUrl: "https://images.pexels.com/photos/1804796/pexels-photo-1804796.jpeg",
  //     username: "狗狗專家",
  //     comment: "建議可以加上運動量的說明，不同品種的狗狗需求不太一樣"
  //   },
  //   {
  //     avatarUrl: "https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg",
  //     username: "新手鏟屎官",
  //     comment: "太實用了！收藏起來慢慢研究"
  //   },
  //   {
  //     avatarUrl: "https://images.pexels.com/photos/1858175/pexels-photo-1858175.jpeg",
  //     username: "寵物營養師",
  //     comment: "專業又易懂的解說，推薦給所有飼主朋友們！"
  //   },
  //   {
  //     avatarUrl: "https://images.pexels.com/photos/1498273/pexels-photo-1498273.jpeg",
  //     username: "多貓家庭",
  //     comment: "養三隻貓的經驗來說，這些建議真的很有用"
  //   }
  // ];

  if (loading) {
    return <div className="text-gray-500">載入留言中...</div>
  }

  if (!comments || comments.length === 0) {
    return <div className="text-gray-500">暫無留言，成為第一個留言的人吧！</div>
  }

  return (
    <div className="flex flex-col gap-8 items-stretch">
      {comments.map((comment) => (
        <CommentSet
          key={comment.id}
          comment={comment}        // 👈 改為傳整個留言對象
          currentUser={currentUser} // 👈 傳當前用戶
          articleAuthorId={articleAuthorId}
          onUpdateComment={onUpdateComment}//更新留言
          onDeleteComment={onDeleteComment}//刪留言
        />
      ))}
    </div>
  )
}
