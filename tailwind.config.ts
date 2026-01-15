/** @type {import('tailwindcss').Config} */
export default {
  content: [
    // Current Vite paths
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    // Future Laravel paths (for migration)
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'Segoe UI', 'Helvetica Neue', 'Arial', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary Colors
        'dental-primary': '#2563EB',
        'dental-success': '#10B981',
        'dental-warning': '#F59E0B',
        'dental-danger': '#EF4444',
        'dental-bg': '#F9FAFB',
        'dental-surface': '#FFFFFF',
        // Side Nav Colors (from tokens.css variables)
        'side-nav-bg': '#f7f9fc',
        'side-nav-border': '#e6edf5',
        'side-nav-text': '#0f172a',
        'side-nav-muted': '#64748b',
        'side-nav-hover-bg': '#eef4ff',
        'side-nav-active-bg': '#e8f1ff',
        'side-nav-active-border': '#2563eb',
        'side-nav-active-text': '#1d4ed8',
        // Card Colors (from tokens.css)
        'card-bg': '#ffffff',
        'card-border': '#e2e8f0',
      },
      borderRadius: {
        'card': '1rem',
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
