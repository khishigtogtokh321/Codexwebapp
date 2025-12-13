export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'Segoe UI', 'Helvetica Neue', 'Arial', 'system-ui', 'sans-serif'],
      },
      colors: {
        'dental-primary': '#2563EB',
        'dental-success': '#10B981',
        'dental-warning': '#F59E0B',
        'dental-danger': '#EF4444',
        'dental-bg': '#F9FAFB',
        'dental-surface': '#FFFFFF',
      },
    },
  },
  plugins: [],
}
