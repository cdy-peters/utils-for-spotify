/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        none: "transparent",
        green: {
          DEFAULT: "#1DB954",
          hover: "#198a41",
        },
        black: {
          DEFAULT: "#000",
          spotify: "#121212",
        },
        gray: {
          100: "#e0e0e0",
          200: "#b3b3b3",
          300: "#a29f9f",
          400: "#535353",
          500: "#3e3e3e",
          600: "#2a2a2a",
          700: "#282828",
          800: "#242424",
          900: "#181818",
        },
        beige: {
          DEFAULT: "#decead",
        },
      },
    },
  },
  plugins: [],
};
