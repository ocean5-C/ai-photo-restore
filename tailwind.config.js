/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ae',
          300: '#f6b87d',
          400: '#f29044',
          500: '#ee741c',
          600: '#de5814',
          700: '#b84213',
          800: '#913415',
          900: '#732b13',
        },
      },
    },
  },
  plugins: [],
}