/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./contexts/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
    "./services/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          '50': '#eff6ff',
          '100': '#dbeafe',
          '200': '#bfdbfe',
          '300': '#93c5fd',
          '400': '#60a5fa',
          '500': '#3b82f6',
          '600': '#2563eb',
          '700': '#1d4ed8',
          '800': '#1e40af',
          '900': '#1e3a8a',
          '950': '#172554'
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        'background': 'rgb(var(--background-rgb) / <alpha-value>)',
        'foreground': 'rgb(var(--foreground-rgb) / <alpha-value>)',
        'card': 'rgb(var(--card-rgb) / <alpha-value>)',
        'card-foreground': 'rgb(var(--card-foreground-rgb) / <alpha-value>)',
        'input': 'rgb(var(--input-rgb) / <alpha-value>)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 0 10px rgba(59, 130, 246, 0)' },
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeIn 0.5s ease-out forwards',
        'pulse': 'pulse 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'bounce-gentle': 'bounceGentle 2s infinite',
      },
      // Add shimmer and bounce animations
      shimmer: {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(100%)' },
      },
      bounceGentle: {
        '0%, 100%': { transform: 'translateY(-5%)' },
        '50%': { transform: 'translateY(0)' },
      },
    },
  },
  plugins: [
    // Add performance-optimized plugins
    function({ addUtilities, addComponents, theme }) {
      const newUtilities = {
        '.skeleton': {
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: theme('colors.gray.200'),
          '&::after': {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            transform: 'translateX(-100%)',
            backgroundImage: `linear-gradient(
              90deg,
              transparent,
              rgba(255, 255, 255, 0.4),
              transparent
            )`,
            animation: 'shimmer 2s infinite',
            content: '""',
          },
        },
        '.lazy-loading': {
          filter: 'blur(5px)',
          transition: 'filter 0.3s ease',
        },
        '.lazy-loaded': {
          filter: 'none',
        },
        '.lazy-error': {
          backgroundColor: theme('colors.gray.200'),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: theme('colors.gray.500'),
          fontSize: theme('fontSize.sm'),
        },
      };

      addUtilities(newUtilities);
    },
  ],
  // Safelist dynamic classes for production
  safelist: [
    'bg-blue-50', 'bg-green-50', 'bg-yellow-50', 'bg-red-50',
    'text-blue-600', 'text-green-600', 'text-yellow-600', 'text-red-600',
    'border-blue-200', 'border-green-200', 'border-yellow-200', 'border-red-200',
    'animate-pulse', 'animate-spin', 'animate-shimmer',
    'skeleton', 'lazy-loading', 'lazy-loaded', 'lazy-error',
    { pattern: /^(bg|text|border)-(blue|green|yellow|red|gray)-(50|100|200|300|400|500|600|700|800|900)$/ }
  ],
}