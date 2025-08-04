import type { Config } from 'tailwindcss'
import { fontFamily, fontSize } from './typography.config'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      xs: '320px',
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1273px',
      '2xl': '1440px',
      '3xl': '1660px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '24px',
        '3xl': '32px',
      },
      screens: {
        xs: '100%',
        sm: '528px',
        md: '720px',
        lg: '936px',
        xl: '1224px',
        '2xl': '1356px',
        '3xl': '1612px',
      },
    },
    extend: {
      gridTemplateColumns: {
        '6': 'repeat(6, minmax(0, 1fr))',
        '12': 'repeat(12, minmax(0, 1fr))',
      },
      gap: {
        '6': '24px',
        '8': '32px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'main-blue': '#256BA7',
        'main-amarant': '#E91651',
        'main-text': '#0D0B0B',
        'main-grey': '#D9D9D9',
      },
      fontFamily,
      fontSize,
    },
  },
  plugins: [],
}

export default config
