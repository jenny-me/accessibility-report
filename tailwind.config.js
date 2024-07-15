/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  darkMode: ['class', 'dark-mode'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  safelist: ['icon-GizmoMinus', 'icon-GizmoPlus'],
  plugins: [],
}

