/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'heading': ['PP Editorial New Ultralight', 'PP Editorial New', 'Georgia', 'serif'],
        'sans': ['Sofia Sans Condensed', 'system-ui', 'sans-serif'],
        'serif': ['PP Editorial New Ultralight', 'PP Editorial New', 'Georgia', 'serif'],
      },
      fontSize: {
        // Sistema de tipografía responsiva con PP Editorial New para headings y Sofia Sans Condensed para body
        'heading-1': ['3.25rem', { lineHeight: '1.1', fontWeight: '200', fontFamily: 'PP Editorial New Ultralight, PP Editorial New, Georgia, serif' }], // 52px
        'heading-1-mobile': ['2.125rem', { lineHeight: '1.1', fontWeight: '200', fontFamily: 'PP Editorial New Ultralight, PP Editorial New, Georgia, serif' }], // 34px
        'heading-2': ['2.75rem', { lineHeight: '1.2', fontWeight: '200', fontFamily: 'PP Editorial New Ultralight, PP Editorial New, Georgia, serif' }], // 44px
        'heading-2-mobile': ['1.875rem', { lineHeight: '1.2', fontWeight: '200', fontFamily: 'PP Editorial New Ultralight, PP Editorial New, Georgia, serif' }], // 30px
        'heading-3': ['2.25rem', { lineHeight: '1.3', fontWeight: '200', fontFamily: 'PP Editorial New Ultralight, PP Editorial New, Georgia, serif' }], // 36px
        'heading-3-mobile': ['1.625rem', { lineHeight: '1.3', fontWeight: '200', fontFamily: 'PP Editorial New Ultralight, PP Editorial New, Georgia, serif' }], // 26px
        'heading-4': ['1.75rem', { lineHeight: '1.4', fontWeight: '200', fontFamily: 'PP Editorial New Ultralight, PP Editorial New, Georgia, serif' }], // 28px
        'heading-4-mobile': ['1.375rem', { lineHeight: '1.4', fontWeight: '200', fontFamily: 'PP Editorial New Ultralight, PP Editorial New, Georgia, serif' }], // 22px
        'body-large': ['1.375rem', { lineHeight: '1.2', fontWeight: '300', fontFamily: 'Sofia Sans Condensed, sans-serif' }], // 22px
        'body-large-mobile': ['1.25rem', { lineHeight: '1.2', fontWeight: '300', fontFamily: 'Sofia Sans Condensed, sans-serif' }], // 20px
        'body': ['1.25rem', { lineHeight: '1.2', fontWeight: '300', fontFamily: 'Sofia Sans Condensed, sans-serif' }], // 20px
        'body-mobile': ['1.125rem', { lineHeight: '1.2', fontWeight: '300', fontFamily: 'Sofia Sans Condensed, sans-serif' }], // 18px
        'small': ['1.125rem', { lineHeight: '1.1', fontWeight: '300', fontFamily: 'Sofia Sans Condensed, sans-serif' }], // 18px
        'small-mobile': ['1rem', { lineHeight: '1.1', fontWeight: '300', fontFamily: 'Sofia Sans Condensed, sans-serif' }], // 16px
      },
      colors: {
        // Paleta basada en el logotipo de Nelly Castro Sánchez
        'brand': {
          'forest': {
            50: '#f0f9f5',
            100: '#dcf2e6',
            200: '#bce5d1',
            300: '#8dd1b3',
            400: '#57b590',
            500: '#1B4D3E', // Verde oscuro principal del logo
            600: '#164033',
            700: '#133329',
            800: '#112a22',
            900: '#0f231d',
          },
          'warm': {
            50: '#fdf9f3',
            100: '#faf2e6',
            200: '#f4e3cc',
            300: '#eccfa6',
            400: '#e2b87a',
            500: '#D4A574', // Marrón claro principal del logo
            600: '#c8965f',
            700: '#b8844a',
            800: '#a6723b',
            900: '#94602e',
          }
        },
        'primary': {
          50: '#f0f9f5',
          100: '#dcf2e6',
          200: '#bce5d1',
          300: '#8dd1b3',
          400: '#57b590',
          500: '#1B4D3E',
          600: '#164033',
          700: '#133329',
          800: '#112a22',
          900: '#0f231d',
        },
        'secondary': {
          50: '#fdf9f3',
          100: '#faf2e6',
          200: '#f4e3cc',
          300: '#eccfa6',
          400: '#e2b87a',
          500: '#D4A574',
          600: '#c8965f',
          700: '#b8844a',
          800: '#a6723b',
          900: '#94602e',
        }
      },
      textColor: {
        'heading': '#1B4D3E', // Color principal para headings
        'heading-muted': '#164033', // Color más suave para headings secundarios
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in-up-delayed': 'fadeInUp 1s ease-out 0.5s both',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
