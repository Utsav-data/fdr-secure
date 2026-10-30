/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aicteBlue: '#0A3A6B',
        aicteBlueDark: '#072749',
        aicteBlueLight: '#E8F1FA',
        aicteYellow: '#F9A825',
        aicteYellowDark: '#E6951A',
        govWhite: '#FFFFFF',
        govNeutral: '#F4F7FA',
        nicGreen: '#138808',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 0.35s ease-out forwards',
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
