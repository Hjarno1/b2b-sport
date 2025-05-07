/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3fb747', // Updated primary green
        'primary-dark': '#359a42', // A suggested darker green for states
        secondary: '#E6F4EA', // A light, minty tone that complements the green
        accent: '#f5f5f5', // Optionally adjust if needed to better relate to the green hue
        background: '#FFFFFF',
        foreground: '#333333',
      },
      spacing: {
        sidebar: '16rem',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/forms'),
  ],
};
