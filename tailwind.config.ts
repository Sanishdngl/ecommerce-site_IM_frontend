/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        paper: '#EAE7DE',
        ink: '#1A1A18',
        kraft: {
          DEFAULT: '#D8CBB0',
          dark: '#BBA97E',
        },
        stamp: {
          DEFAULT: '#A3272B',
          dark: '#7E1F22',
          50: '#F3E4E2',
        },
        moss: {
          DEFAULT: '#4B5D3A',
          dark: '#3A4A2C',
          50: '#E8ECE2',
        },
        // Admin-only tokens. Scoped via .admin-shell in index.css.
        // Deliberately distinct namespace/palette from the storefront
        // tokens above — different genre (operations tooling vs retail).
        console: '#F2F4F5',
        panel: '#10151A',
        hairline: '#D7DCDF',
        graphite: '#12181B',
        signal: {
          DEFAULT: '#2B7A78',
          dim: '#1F5957',
          50: '#E4EEED',
        },
      },
      fontFamily: {
        // Additive — font-sans stays Tailwind's default so admin is untouched.
        display: ['"Fraunces"', 'serif'],
        body: ['"Work Sans"', 'sans-serif'],
        stamp: ['"IBM Plex Mono"', 'monospace'],
        admin: ['"IBM Plex Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
