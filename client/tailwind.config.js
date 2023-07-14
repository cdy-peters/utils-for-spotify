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
          300: "#b3b3b3",
          600: "#242424",
          650: "#2a2a2a",
          700: "#535353",
          800: "#282828",
          900: "#181818"
        },
      },
    },
  },
  plugins: [],
};
