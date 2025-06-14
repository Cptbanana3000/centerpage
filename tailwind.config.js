/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
      './src/components/**/*.{js,ts,jsx,tsx,mdx}',
      './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
      extend: {
        fontFamily: {
          'inter': ['Inter', 'sans-serif'],
        },
        colors: {
          'brand-purple': '#667eea',
          'brand-purple-dark': '#764ba2',
        },
        animation: {
          'float': 'float 6s ease-in-out infinite',
          'fill-progress': 'fill-progress 2s ease-out forwards',
          'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        },
        keyframes: {
          float: {
            '0%, 100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-10px)' },
          },
          'fill-progress': {
            'from': { 
              'stroke-dashoffset': '314',
              'opacity': '0.5'
            },
            'to': { 
              'stroke-dashoffset': 'var(--stroke-dashoffset)',
              'opacity': '1'
            }
          },
          'pulse-glow': {
            '0%, 100%': { 
              'box-shadow': '0 0 5px rgba(102, 126, 234, 0.5)'
            },
            '50%': { 
              'box-shadow': '0 0 20px rgba(102, 126, 234, 0.8)'
            }
          }
        },
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
      },
    },
    plugins: [],
  } 