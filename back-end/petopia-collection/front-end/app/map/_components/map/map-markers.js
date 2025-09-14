// components/map/MapMarkers.js
// 地圖標記相關的組件和配置

import React from 'react'
import { Marker, Circle } from 'react-leaflet'
import L from 'leaflet'
import { formatDistance } from './distance-calculation'

/**
 * 類別配置 - 顏色和名稱
 */
export const categoryStyles = {
  '寵物友善餐廳': { color: '#F5AB54', name: '餐廳' },
  '寵物公園': { color: '#1A9562', name: '公園' },
  '寵物美容': { color: '#CF9DCA', name: '美容' },
  '寵物旅館': { color: '#ED8066', name: '旅館' },
  '毛孩店長': { color: '#FCD34D', name: '店長' },
  '寵物用品': { color: '#84CC16', name: '用品' },
  '特寵友善': { color: '#9FC4E8', name: '特寵' },
  '公用設施': { color: '#7F1D1D', name: '設施' },
  '寵物醫院': { color: '#075985', name: '醫院' }
}

/**
 * 創建寵物地點的自定義標記圖標
 * @param {string} category - 地點類別
 * @param {number} distance - 距離（公里）
 * @returns {L.DivIcon} Leaflet 圖標對象
 */
export const createCustomIcon = (category) => {
  const style = categoryStyles[category] || categoryStyles['寵物友善餐廳']
  
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
      ">
        <!-- FontAwesome Map Marker -->
        <div style="
          color: ${style.color};
          font-size: 32px;
        ">
          <svg width="32" height="32" viewBox="0 0 384 512" fill="currentColor">
            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
          </svg>
        </div>
      </div>
    `,
    className: 'custom-marker-with-distance',
    iconSize: [32, 50],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

/**
 * 創建用戶位置標記圖標
 * @returns {L.DivIcon} Leaflet 圖標對象
 */
export const createUserLocationIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #007AFF;
        border: 3px solid white;
        border-radius: 50%;
      "></div>
    `,
    className: 'user-location-marker',
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  })
}

/**
 * 用戶位置標記組件
 */
export function UserLocationMarker({ userLocation }) {
  return userLocation ? (
    <Marker position={userLocation} icon={createUserLocationIcon()} />
  ) : null
}

/**
 * 搜尋範圍圓圈組件
 */
export function SearchRadiusCircle({ center, radius }) {
  return (
    <Circle 
      center={center} 
      radius={radius * 1000} // 轉換為公尺
      fillColor="blue"
      fillOpacity={0.1}
      color="blue"
      weight={2}
    />
  )
}

/**
 * 寵物地點標記組件
 */
export function PetPlaceMarker({ place, onMarkerClick }) {
  return (
    <Marker
      position={place.position}
      icon={createCustomIcon(place.category, place.distance)}
      eventHandlers={{
        click: () => onMarkerClick && onMarkerClick(place)
      }}
    >
    </Marker>
  )
}

/**
 * 類別篩選按鈕組件
 */
export function CategoryFilterButton({ 
  category, 
  isSelected, 
  onClick 
}) {
  const style = categoryStyles[category]
  
  return (
    <button
      onClick={() => onClick(category)}
      className={`
        px-2 py-1 rounded-full text-xs font-medium transition-colors flex items-center gap-1
        ${isSelected
          ? 'text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
      style={{
        backgroundColor: isSelected ? style.color : undefined
      }}
    >
      <svg width="12" height="12" viewBox="0 0 384 512" fill="currentColor">
        <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
      </svg>
      {style.name}
    </button>
  )
}

/**
 * 地點列表項目組件
 */
export function PlaceListItem({ place, isSelected, onClick }) {
  const style = categoryStyles[place.category]
  
  return (
    <div 
      className={`
        p-3 border-b cursor-pointer hover:bg-gray-50 transition-colors
        ${isSelected ? 'bg-blue-50' : ''}
      `}
      role="button"
      tabIndex={0}
      onClick={() => onClick && onClick(place)}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick && onClick(place);
        }
      }}
      aria-pressed={isSelected}
    >
      <div className="flex items-start gap-3">
        <div 
          className="w-8 h-8 rounded flex items-center justify-center text-white text-xs flex-shrink-0"
          style={{ backgroundColor: style.color }}
        >
          <svg width="16" height="16" viewBox="0 0 384 512" fill="currentColor">
            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{place.name}</h4>
          <div className="text-xs text-gray-600 mt-1">
            ⭐ {place.rating} • {place.category}
          </div>
          <div className="text-xs text-gray-500 mt-1 truncate">{place.address}</div>
          <div className="text-xs font-medium text-blue-600 mt-1">
            📍 {formatDistance(place.distance)}
          </div>
        </div>
      </div>
    </div>
  )
}