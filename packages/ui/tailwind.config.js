/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './demo/**/*.{html,js,svelte,ts}',
    './components/**/*.{html,js,svelte,ts}',
    './pages/**/*.{html,js,svelte,ts}'
  ],
  safelist: [
    'bg-white',
    'text-gray-700',
    'text-gray-500',
    'text-gray-900',
    'border-transparent',
    'border-[#E0E0E0]',
    'border-[#FF5252]',
    'bg-[#F5F5F5]',
    'bg-[#FFF8F8]',
    'text-[#FF5252]',
    'text-[#0288D1]',
    'text-[#01579B]',
    'text-[#2E7D32]',
    'bg-[#00A651]',
    'w-full'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2E7D32',
          dark: '#1B5E20',
          light: '#4CAF50'
        },
        secondary: {
          DEFAULT: '#FF8F00',
          dark: '#F57C00',
          light: '#FFB74D'
        },
        accent: {
          DEFAULT: '#0288D1',
          dark: '#01579B',
          light: '#4FC3F7'
        }
      }
    },
  },
  plugins: [],
}
