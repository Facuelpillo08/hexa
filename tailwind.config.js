/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-paper': '#EAE8E3',
        'bg-panel': '#F4F3EF',
        'text-ink': '#121316',
        'text-tech': '#5A6065',
        'border-grid': '#C7CBD1',
        'accent-cobalt': '#1E40AF',
        'accent-cobalt-hover': '#1D4ED8',
        'status-yellow': '#FACC15',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      boxShadow: {
        'tech': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'panel': '0 8px 30px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
