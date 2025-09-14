export default function SelectedTags({ selectedSubs, onRemoveTag }) {
  if (selectedSubs.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 my-3">
      {selectedSubs.map((tag) => (
        <div
          key={tag}
          className="flex items-center gap-3 border-[1px] border-primary text-primary px-4 py-1 rounded-full"
        >
          <span>{tag}</span>
          <button
            type="button"
            onClick={() => onRemoveTag(tag)}
            className="text-primary hover:text-black"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}