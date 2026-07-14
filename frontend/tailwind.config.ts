import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0057D9',
          dark: '#003DA0',
          light: '#1E73FF',
        },
        secondary: {
          DEFAULT: '#FFD400',
          dark: '#E6BF00',
          light: '#FFDD33',
        },
        neutral: {
          white: '#FFFFFF',
          'light-gray': '#F8FAFC',
          'dark-gray': '#1F2937',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        heading: ['var(--font-poppins)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
