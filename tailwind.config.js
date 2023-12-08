/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js}",
    "./node_modules/tw-elements-react/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      animation: {
        'shake': 'shake 0.75s cubic-bezier(.0, .0, .0, .0) ',
      },
    },
    fontFamily: {
      KOTRAHOPE: ["KOTRAHOPE"],
    },
  },
  darkMode: "class",
  plugins: [
    require('@tailwindcss/forms'),
    require("tw-elements-react/dist/plugin.cjs")
  ],
}