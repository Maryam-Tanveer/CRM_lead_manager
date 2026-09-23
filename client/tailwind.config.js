export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
          DEFAULT: 'var(--color-primary-500)',
          hover: 'var(--color-primary-600)'
        },
        surface: {
          base: 'var(--color-bg-base)',
          card: 'var(--color-bg-card)',
          hover: 'var(--color-bg-hover)',
          muted: 'var(--color-bg-muted)'
        },
        borderTheme: 'var(--color-border)',
        content: {
          main: 'var(--color-text-main)',
          muted: 'var(--color-text-muted)',
          subtle: 'var(--color-text-subtle)'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
};
