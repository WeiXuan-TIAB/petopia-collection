import { Checkbox } from '@/app/_components/ui/checkbox'

export default function CategorySidebar({
  categoryInfos,
  selectedMainCatIds,
  selectedSubCatNames,
  onToggleMainCat,
  onToggleSubCat
}) {
  return (
    <div className="hidden md:flex flex-col flex-shrink-0 w-40 gap-6">
      {categoryInfos.map((category) => (
        <div key={category.name}>
          <h5 className="text-lg text-primary font-semibold pb-2 border-b-2 border-brand-warm border-dotted">
            {category.name}
          </h5>
          <div className="flex flex-col pt-3 gap-2">
            {category.subCategories.map((sub) => (
              <label key={sub.id} className="flex items-center gap-2">
                <Checkbox
                  checked={
                    category.name === '寵物專區'
                      ? selectedMainCatIds.includes(sub.id)
                      : selectedSubCatNames.includes(sub.name)
                  }
                  onCheckedChange={() =>
                    category.name === '寵物專區'
                      ? onToggleMainCat(sub.id, sub.name)
                      : onToggleSubCat(sub.id, sub.name)
                  }
                />
                {sub.name}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
