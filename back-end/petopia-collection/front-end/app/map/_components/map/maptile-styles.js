// components/map/MapTileStyles.js
// 不同的地圖瓦片樣式配置

export const MAP_STYLES = {
  // 1. CartoDB Positron - 乾淨的白色樣式（推薦）
  CARTODB_POSITRON: {
    name: '白色樣式 (推薦)',
    url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },

  // 2. CartoDB Positron 無標籤 - 更乾淨的白色樣式
  CARTODB_POSITRON_NOLABELS: {
    name: '極簡白色 (無標籤)',
    url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },

  // 3. 只有標籤層，搭配無標籤使用
  CARTODB_POSITRON_LABELS: {
    name: '純標籤層',
    url: 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },

  // 4. OpenStreetMap 標準樣式
  OPENSTREETMAP: {
    name: 'OpenStreetMap 標準',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },

  // 5. CartoDB Voyager - 平衡的彩色樣式
  CARTODB_VOYAGER: {
    name: 'CartoDB Voyager (彩色)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  },

  // 6. CartoDB Dark Matter - 深色樣式
  CARTODB_DARK: {
    name: '深色樣式',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
  }
}

// 預設使用 CartoDB Positron（白色樣式）
export const DEFAULT_MAP_STYLE = MAP_STYLES.CARTODB_POSITRON