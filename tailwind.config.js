/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        inter:   ['Inter', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        navy: {
          DEFAULT: '#0D1F3C',
          600:     '#1B3561',
          400:     '#2D5FA6',
          50:      '#F0F4FA',
          100:     '#D6E0F0',
        },
        gold: {
          DEFAULT: '#C49A3C',
          light:   '#D4AF6A',
          dark:    '#A07B28',
        },
        ink:    '#0D1F3C',
        canvas: '#F7F6F2',
        border: '#E2E0DA',
      },
      boxShadow: {
        card:  '0 1px 4px rgba(13,31,60,0.07), 0 1px 2px rgba(13,31,60,0.05)',
        hover: '0 8px 32px rgba(13,31,60,0.12)',
        navy:  '0 4px 20px rgba(13,31,60,0.25)',
      },
    },
  },
  plugins: [],
}
