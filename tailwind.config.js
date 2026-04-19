/** @type {import('tailwindcss').Config} */
const { fontFamily } = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#083c3b",
          darkHover: "#0f5e5a",
          cyan: "#00f5d4",
          button: "#16c784",
          backgroundColor: "#0D1117",
          primaryColor: "#00FFFF",
          ctaBtnColor: "#00FF7F",
          accentColor: "#FF00FF",
          fontColor: "#FFFFFF"
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', ...fontFamily.sans],
      },
    },
  },
  plugins: [],
};
