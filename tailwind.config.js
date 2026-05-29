/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cores suaves inspirando tranquilidade
        'casa-bg': '#f8fafc',
        'casa-text': '#334155',
        'casa-accent': '#94a3b8',
        'casa-primary': '#475569',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
