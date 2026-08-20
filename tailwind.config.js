/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0e17', panel: '#0f1522', card: '#111a2b',
        neon: '#00ff88', danger: '#ff4d6d', warn: '#ffc53d',
        slate: { 
          400: '#a6b2c5',
          500: '#8494ab',
          600: '#66788f',
        },
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'Inter', 'system-ui', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 16px rgba(0,255,136,.25)',
        'glow-danger': '0 0 16px rgba(255,77,109,.25)',
      },
      animation: { shake: 'shake .4s cubic-bezier(.36,.07,.19,.97) both' },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
      },
    },
  },
  plugins: [],
};/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0e17', panel: '#0f1522', card: '#111a2b',
        neon: '#00ff88', danger: '#ff4d6d', warn: '#ffc53d',
        slate: {                      // lifted for readability on dark
          400: '#a6b2c5',
          500: '#8494ab',
          600: '#66788f',
        },
      },
      fontFamily: {
        display: ['"Chakra Petch"', 'Inter', 'system-ui', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 16px rgba(0,255,136,.25)',
        'glow-danger': '0 0 16px rgba(255,77,109,.25)',
      },
      animation: { shake: 'shake .4s cubic-bezier(.36,.07,.19,.97) both' },
      keyframes: {
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        },
      },
    },
  },
  plugins: [],
};