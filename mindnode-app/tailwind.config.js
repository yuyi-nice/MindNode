/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'v2-bg-page': '#fafafa',
        'v2-bg-surface': '#ffffff',
        'v2-fg': '#0a0a0a',
        'v2-fg-secondary': '#525252',
        'v2-fg-tertiary': '#737373',
        'v2-border': '#e5e5e5',
        'v2-accent': '#6366f1',
        'v2-accent-muted': '#eef2ff',
        'v2-accent-fg': '#4338ca',
        'v2-success': '#22c55e',
        'v2-success-muted': '#f0fdf4',
      },
    },
  },
  plugins: [],
}
