/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
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
          700: "#535353",
          900: "#212121",
        },
      },
    },
  },
  plugins: [],
};
