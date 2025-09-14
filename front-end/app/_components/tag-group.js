
export default function TagGroup({ 
  content = {}, 
  selectedVar, 
  setSelectedVar }) {
  const handleSelect = (value) => setSelectedVar(value)
    let items = Array.isArray(content)
    ? content
    : content?.mainCategories ?? [];
  return (
    <>
      <div className='flex flex-row flex-wrap gap-2'>
        {items.map((item) => {
          return (
            <button
              onClick={()=>handleSelect(item)}
              key={item}
              className={`inline-block border-solid border-2 rounded-5xl py-1 px-4 text-fp-h6 
              ${item ===selectedVar
                ? 'border-primary text-primary'
                : 'border-border-secondary text-brand-warm hover:border-primary hover:text-primary'
              }`}
            >
              {item}
            </button>
          );
        })}

      </div>

    </>
  )
}
