import { describe } from 'node:test'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        latte: '#f6e9d9',
        coffee: '#4f2206',
        geyser: '#DFC13F',
        coffee_transparent: 'rgba(79, 34, 6, 0.7)',
        text_describe: '#232124',
      },
    },
  },
  plugins: [],
}
export default config
