/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
    './app/**/*.{js,jsx}',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        dark: {
          200: '#0D0F10',
          300: '#020817',
          400: '#1A1D21',
          500: '#363A3D',
          600: '#76828D',
          700: '#ABB8C4',
        },
      },
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
        condiment: ['Condiment', 'sans-serif'],
        bad: ['Bad Script', 'sans-serif'],
        borel: ['Borel', 'sans-serif'],
      },
      screens: {
        xs: '400px',
        '3xl': '1680px',
        '4xl': '2200px',
      },
    },
  },
  plugins: [addVariablesForColors],
};

// Plugin to add Tailwind colors as CSS variables
function addVariablesForColors({ addBase, theme }) {
  const colors = theme('colors');
  const newVars = {};

  // Flatten the color palette
  for (const [color, values] of Object.entries(colors)) {
    if (typeof values === 'object') {
      for (const [shade, hex] of Object.entries(values)) {
        newVars[`--${color}-${shade}`] = hex;
      }
    } else {
      newVars[`--${color}`] = values;
    }
  }

  addBase({
    ':root': newVars,
  });
}
