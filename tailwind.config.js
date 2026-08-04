/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f5ff",
          100: "#dbe7ff",
          400: "#5b8def",
          500: "#3866d6",
          600: "#2b4fb0",
          700: "#233f8c",
        },
      },
    },
  },
  plugins: [],
};
