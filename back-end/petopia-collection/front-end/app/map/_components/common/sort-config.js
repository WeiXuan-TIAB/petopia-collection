// app/map/_components/common/sort-config.js
const sortConfigData = {
  places: [
    { value: 'distance',     label: '距離最近' },
    { value: 'rating_desc',  label: '評分最高', default: true }, // 預設
    { value: 'created_desc', label: '最新' },
  ],
  reviews: [
    { value: 'created_desc', label: '最新', default: true },
    { value: 'rating_desc',  label: '評分最高' },
    { value: 'rating_asc',   label: '評分最低' },
  ],
  photos: [
    { value: 'created_desc', label: '最新', default: true },
    { value: 'rating_desc',  label: '評分最高' },
    { value: 'rating_asc',   label: '評分最低' },
  ],
}

export default sortConfigData

export function getDefaultSort(context = 'places') {
  const list = sortConfigData[context] || []
  return list.find(o => o.default)?.value || list[0]?.value || ''
}