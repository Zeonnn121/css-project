export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#0f0f0f',
          800: '#1a1a1a',
          700: '#2a2a2a',
          600: '#3a3a3a',
        },
        security: {
          red: '#dc2626',
          green: '#10b981',
          yellow: '#f59e0b',
          blue: '#3b82f6',
        }
      }
    }
  },
  plugins: [],
}
