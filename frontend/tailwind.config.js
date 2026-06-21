/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f4ff",
          100: "#dde7ff",
          200: "#c2d3ff",
          300: "#9ab5fd",
          400: "#708dfa",
          500: "#4d67f5",
          600: "#3648ea",
          700: "#2c38cf",
          800: "#2831a7",
          900: "#272f84",
          950: "#1a1e52",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
