'use client'

export default function HashtagSelector({
  label = "Hashtag",
  hashtags = ["聰明", "可愛", "漂亮", "聽話", "淘氣"],
  selectedTags = [],
  onChange = () => {}
}) {

  const handleTagToggle = (tag) => {
    const isSelected = selectedTags.includes(tag);
    let newSelectedTags;
    
    if (isSelected) {
      newSelectedTags = selectedTags.filter(t => t !== tag);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }
    
    onChange(newSelectedTags);
  };

  return (
    <div>
      <label className="text-xl">{label}</label>
      <div className="flex flex-wrap gap-2 mt-2">
        {hashtags.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagToggle(tag)}
            className={`px-3 py-1 rounded border ${
              selectedTags.includes(tag)  //  重點：根據 selectedTags 改變樣式
                ? 'bg-orange-500 text-white border-orange-500'  // 選中樣式
                : 'bg-white text-orange-500 border-orange-500'  // 未選中樣式
            }`}
          >
            {selectedTags.includes(tag) ? '✓ ' : ''}{tag}  {/*  顯示勾選符號 */}
          </button>
        ))}
      </div>
    </div>
  );
}