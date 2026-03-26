import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      // Primary accent color used throughout the app: indigo
      colors: {
        primary: {
          DEFAULT: '#4f46e5', // indigo-600
          hover: '#4338ca',   // indigo-700
        },
      },
      fontSize: {
        // Enforce minimum readable text size for office staff
        base: ['1rem', { lineHeight: '1.6' }],      // 16px
        lg: ['1.125rem', { lineHeight: '1.6' }],     // 18px
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

export default config
