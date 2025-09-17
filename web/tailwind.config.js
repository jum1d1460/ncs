/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      fontSize: {
        // Sistema de tipografía responsiva
        'heading-1': ['3rem', { lineHeight: '1.1', fontWeight: '800' }], // 48px
        'heading-1-mobile': ['2rem', { lineHeight: '1.1', fontWeight: '800' }], // 32px
        'heading-2': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }], // 40px
        'heading-2-mobile': ['1.75rem', { lineHeight: '1.2', fontWeight: '700' }], // 28px
        'heading-3': ['2rem', { lineHeight: '1.3', fontWeight: '600' }], // 32px
        'heading-3-mobile': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }], // 24px
        'heading-4': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }], // 24px
        'heading-4-mobile': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }], // 20px
        'body-large': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }], // 18px
        'body-large-mobile': ['1rem', { lineHeight: '1.6', fontWeight: '400' }], // 16px
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }], // 16px
        'body-mobile': ['0.875rem', { lineHeight: '1.5', fontWeight: '400' }], // 14px
        'small': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }], // 14px
        'small-mobile': ['0.75rem', { lineHeight: '1.4', fontWeight: '400' }], // 12px
      },
      colors: {
        'primary': {
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
        'secondary': {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        }
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
