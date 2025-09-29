/**
 * Professional Design System for Broker Analysis Platform
 * Consistent colors, typography, spacing, and design tokens
 */

export const designSystem = {
  // Professional Color Palette
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Primary brand color
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'monospace'],
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  // Spacing Scale
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },

  // Border Radius
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },

  // Shadow System
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Component Tokens
  components: {
    card: {
      background: '#ffffff',
      border: '#e5e7eb',
      borderRadius: '0.5rem',
      shadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      padding: '1.5rem',
    },
    badge: {
      borderRadius: '0.375rem',
      padding: '0.25rem 0.75rem',
      fontSize: '0.875rem',
      fontWeight: '500',
    },
    button: {
      borderRadius: '0.375rem',
      fontWeight: '500',
      transition: 'all 0.2s ease-in-out',
    },
  },

  // Semantic Colors for Specific Use Cases
  semantic: {
    rating: {
      excellent: '#22c55e', // 4.5-5.0 stars
      good: '#84cc16',      // 3.5-4.4 stars  
      average: '#eab308',   // 2.5-3.4 stars
      poor: '#f97316',      // 1.5-2.4 stars
      bad: '#ef4444',       // 0-1.4 stars
    },
    status: {
      regulated: '#22c55e',
      unregulated: '#ef4444',
      pending: '#eab308',
    },
    performance: {
      high: '#22c55e',
      medium: '#84cc16',
      low: '#f97316',
    },
  },
} as const;

// Helper functions
export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return designSystem.semantic.rating.excellent;
  if (rating >= 3.5) return designSystem.semantic.rating.good;
  if (rating >= 2.5) return designSystem.semantic.rating.average;
  if (rating >= 1.5) return designSystem.semantic.rating.poor;
  return designSystem.semantic.rating.bad;
};

export const getStatusColor = (isRegulated: boolean): string => {
  return isRegulated ? designSystem.semantic.status.regulated : designSystem.semantic.status.unregulated;
};

export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};