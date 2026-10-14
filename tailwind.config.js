/** Spendr Tailwind config — maps CSS variables in global.css to class names.
 *  Spacing uses the default Tailwind scale; metro.config.js sets inlineRem: 16
 *  so p-1 = 4px, p-4 = 16px on every platform (4-pt grid). */

const color = (name) => `rgb(var(--${name}) / <alpha-value>)`;

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: color('background'),
        foreground: color('foreground'),
        card: {
          DEFAULT: color('card'),
          foreground: color('foreground'),
        },
        muted: {
          DEFAULT: color('muted'),
          foreground: color('muted-foreground'),
        },
        border: color('border'),
        primary: {
          DEFAULT: color('primary'),
          foreground: color('primary-foreground'),
        },
        destructive: {
          DEFAULT: color('destructive'),
          foreground: color('destructive-foreground'),
        },
        credit: color('credit'),
        debit: color('debit'),
        warning: color('warning'),
        need: {
          must: color('need-must'),
          necessary: color('need-necessary'),
          nice: color('need-nice'),
          avoidable: color('need-avoidable'),
        },
      },
      fontFamily: {
        // Custom fonts on native need one family per weight.
        sans: ['Inter_400Regular', 'system-ui', 'sans-serif'],
        'sans-medium': ['Inter_500Medium', 'system-ui', 'sans-serif'],
        'sans-semibold': ['Inter_600SemiBold', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        display: ['32px', { lineHeight: '40px' }],
        title: ['20px', { lineHeight: '28px' }],
        heading: ['17px', { lineHeight: '24px' }],
        body: ['15px', { lineHeight: '22px' }],
        label: ['13px', { lineHeight: '18px' }],
        caption: ['11px', { lineHeight: '16px' }],
      },
      borderRadius: {
        sm: '8px', // alias: same as lg
        lg: '8px', // inputs, chips
        xl: '12px', // cards
        '2xl': '16px', // sheets
      },
      transitionDuration: {
        fast: '150ms',
        base: '250ms',
      },
    },
  },
  plugins: [],
};
