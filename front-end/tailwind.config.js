const { icon } = require('@fortawesome/fontawesome-svg-core')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,

      // screens: {
      //   DEFAULT: '1280px',
      // },
    },
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      DEFAULT: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      '4xl': '2rem',
      '5xl': '2.5rem',
      '6xl': '3rem',
      '7xl': '3.5rem',
      '8xl': '4rem',
      full: '9999px',
    },
    extend: {
      aspectRatio: {
        '3/2': '3 / 2',
        '4/3': '4 / 3',
      },
      colors: {
        // 主識別色
        
          primary: '#ee5a36', // 暖豐橙
          primary2: '#EDA795',
          primary4: '#ED8066',
          primary7: '#BA3818',
        

        // 品牌強調色
        brand: {
          warm: '#f5ab54', // 胖橘黃
          warm2: '#F5D0A4',
          warm3: '#F5C893',
          warm4: '#F5BF7F',
          warm5: '#F5B66C',
          light: '#FEF1EA', // 信露色
        },

        // 輔助色群
        support: {
          success: '#1b9562', // 松針綠
          info: '#3fc4eb', // 霧晴藍
          dark: '#c65f3a', // 可可棕
          dark9: '#823519', // 可可棕
          light: '#c9b9ac', // 沙昔灰
          accent: '#ee5f3a', // 焦糖紅
          purple: '#FFB9B1', // 薰紫紫
        },

        text: {
          primary: '#3E2E2E', // 主要文字（可可棕）
          secondary: '#C8B8AC', // 淺色文字（沙岩灰）
          dark: '0A0A0A', // 毛影黑
          light: '#F5F5F5', // 淺色文字（絨霧白）
          bprimary: '#ee5a36', // 品牌主色（罌粟橙）
          bsecondary: '#f5ab54', // 品牌次色（胖橘黃）
          commentbtn: '#eda795', //留言按鈕(罌粟橙)
        },

        background: {
          primary: '#FEF1EA', // 主背景（桃霧色）
          secondary: '#F5F5F5', // 絨霧白
        },

        border: {
          primary: '#ee5a36', // 主邊框_罌粟橙
          secondary: '#f5ab54', // 次邊框_胖橘黃
          dark: '#3E2E2E', // 深色邊框_可可棕
          light: '#C8B8AC', // 淺色邊框_沙昔灰
        },

        button: {
          primary: '#ee5a36', // 主按鈕_暖豐橙
          secondary: '#f5ab54', // 次按鈕_胖橘黃
          cart: '#679289', // 購物車按鈕_green/500
          add: '#C8B8AC', // 增加按鈕_沙岩灰
          revise: '#3fc4eb', // 霧晴藍
          info: '#0046F6',
          like: '#D9534F', //喜愛按鈕
        },

        status: {
          success: '#1b9562', // 成功狀態_松針綠
          warning: '#ee5a36', // 警告狀態_罌粟橙
          fail: '#ee5f3a', // 失敗狀態_焦糖紅
        },

        icon: {
          dark: '#3E2E2E', // 深色_可可棕
          primary: '#C8B8AC', // 淺色_沙昔灰
          light: '#F5F5F5', // 淺色_絨霧白
        },
      },
      fontFamily: {
        // 假粉圓體字型系列
        'fake-pearl': ['FakePearl-Regular', 'system-ui', 'sans-serif'],
        'fake-pearl-hero': [
          'FakePearl-Regular-Hero',
          'FakePearl-Regular',
          'system-ui',
          'sans-serif',
        ],
        'fake-pearl-h1': [
          'FakePearl-Regular-H1',
          'FakePearl-Regular',
          'system-ui',
          'sans-serif',
        ],
        'fake-pearl-h2': [
          'FakePearl-Regular-H2',
          'FakePearl-Regular',
          'system-ui',
          'sans-serif',
        ],
        'fake-pearl-h3': [
          'FakePearl-Regular-H3',
          'FakePearl-Regular',
          'system-ui',
          'sans-serif',
        ],
        'fake-pearl-h4': [
          'FakePearl-Regular-H4',
          'FakePearl-Regular',
          'system-ui',
          'sans-serif',
        ],
        'fake-pearl-h5': [
          'FakePearl-Regular-H5',
          'FakePearl-Regular',
          'system-ui',
          'sans-serif',
        ],
        'fake-pearl-h6': [
          'FakePearl-Regular-H6',
          'FakePearl-Regular',
          'system-ui',
          'sans-serif',
        ],
        'fake-pearl-body': [
          'FakePearl-Regular-Body',
          'FakePearl-Regular',
          'system-ui',
          'sans-serif',
        ],
      },
      // 自定義字型大小和行高 (對應不同字重)

      //各級標題
      fontSize: {
        'fp-hero': ['48px', { lineHeight: '57.6px', fontWeight: '900' }], // 48 * 1.2
        'fp-h1': ['40px', { lineHeight: '52px', fontWeight: '800' }], // 40 * 1.3
        'fp-h2': ['32px', { lineHeight: '41.6px', fontWeight: '700' }], // 32 * 1.3
        'fp-h3': ['28px', { lineHeight: '39.2px', fontWeight: '600' }], // 28 * 1.4
        'fp-h4': ['24px', { lineHeight: '33.6px', fontWeight: '600' }], // 24 * 1.4
        'fp-h5': ['20px', { lineHeight: '30px', fontWeight: '500' }], // 20 * 1.5
        'fp-h6': ['18px', { lineHeight: '27px', fontWeight: '500' }], // 18 * 1.5
        // 內文和小字
        'fp-body': ['16px', { lineHeight: '25.6px', fontWeight: '400' }], // 16 * 1.6
        'fp-small': ['14px', { lineHeight: '22.4px', fontWeight: '400' }], // 14 * 1.6
      },
      // 字重配置
      fontWeight: {
        'fp-light': '300',
        'fp-normal': '400',
        'fp-medium': '500',
        'fp-semibold': '600',
        'fp-bold': '700',
        'fp-extrabold': '800',
        'fp-black': '900',
      },
    },
  },
  plugins: [require('tailwind-scrollbar-hide')],
}

//使用方法
//<h1 className="font-fake-pearl-hero text-fp-hero">Hero 標題</h1>
