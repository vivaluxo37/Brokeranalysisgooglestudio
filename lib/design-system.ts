/**
 * Professional Design System
 * Consistent colors, spacing, and icon usage guidelines
 */

// Professional Blue Color Palette
export const colors = {
  // Primary Blues (main brand colors)
  primary: {
    50: '#eff6ff',   // Very light blue background
    100: '#dbeafe',  // Light blue for subtle backgrounds
    200: '#bfdbfe',  // Light blue for borders/dividers
    300: '#93c5fd',  // Medium light blue for hover states
    400: '#60a5fa',  // Medium blue for secondary elements
    500: '#3b82f6',  // Main brand blue (default primary)
    600: '#2563eb',  // Primary button color
    700: '#1d4ed8',  // Primary button hover
    800: '#1e40af',  // Dark blue for text
    900: '#1e3a8a',  // Darkest blue for strong emphasis
  },

  // Professional Grays (for text and backgrounds)
  gray: {
    50: '#f9fafb',   // Lightest gray for backgrounds
    100: '#f3f4f6',  // Light gray for cards
    200: '#e5e7eb',  // Border color
    300: '#d1d5db',  // Muted borders
    400: '#9ca3af',  // Placeholder text
    500: '#6b7280',  // Secondary text
    600: '#4b5563',  // Primary text
    700: '#374151',  // Dark text
    800: '#1f2937',  // Headings
    900: '#111827',  // Darkest text
  },

  // Success/Green (minimal usage)
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
  },

  // Warning/Orange (minimal usage)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  // Error/Red (minimal usage)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
};

// Professional Typography Scale
export const typography = {
  // Font sizes (in rem)
  text: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
  },
  
  // Font weights
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },
  
  // Line heights
  leading: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Professional Spacing Scale
export const spacing = {
  0: '0',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem',    // 96px
  32: '8rem',    // 128px
};

// Professional Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
};

// Professional Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

// Icon Usage Guidelines
export const iconGuidelines = {
  // Preferred icon sizes (in pixels)
  sizes: {
    xs: 12,    // Very small icons in text
    sm: 16,    // Small icons in buttons/labels
    base: 20,  // Default icon size
    lg: 24,    // Large icons in cards
    xl: 32,    // Extra large icons in features
    '2xl': 48, // Hero section icons
  },
  
  // Professional blue colors for icons
  colors: {
    primary: colors.primary[600],     // #2563eb - main icon color
    secondary: colors.primary[500],   // #3b82f6 - secondary icon color
    muted: colors.gray[400],         // #9ca3af - muted/disabled icons
    success: colors.success[600],     // #059669 - success state icons
    warning: colors.warning[600],     // #d97706 - warning state icons
    error: colors.error[600],        // #dc2626 - error state icons
  },
  
  // When to use icons (minimize usage)
  usage: {
    essential: [
      'Navigation arrows (chevron)',
      'Interactive states (close, menu)',
      'Status indicators (check, error)',
      'Core actions (search, filter)',
    ],
    avoid: [
      'Decorative icons without function',
      'Multiple icons in same context',
      'Complex illustrated icons',
      'Icons that don't add meaning',
    ],
  },
};

// Component Style Presets
export const components = {
  // Professional button styles
  button: {
    primary: `bg-${colors.primary[600]} hover:bg-${colors.primary[700]} text-white font-medium`,
    secondary: `border border-${colors.primary[600]} text-${colors.primary[600]} hover:bg-${colors.primary[50]} font-medium`,
    ghost: `text-${colors.gray[700]} hover:bg-${colors.gray[100]} font-medium`,
  },
  
  // Professional card styles
  card: {
    base: `bg-white border border-${colors.gray[200]} rounded-${borderRadius.lg} shadow-${shadows.sm}`,
    hover: `hover:border-${colors.primary[300]} hover:shadow-${shadows.md} transition-all`,
    interactive: `hover:border-${colors.primary[500]} hover:shadow-${shadows.lg} hover:-translate-y-1 transition-all`,
  },
  
  // Professional input styles
  input: {
    base: `border border-${colors.gray[300]} rounded-${borderRadius.md} px-3 py-2 focus:ring-2 focus:ring-${colors.primary[500]} focus:border-${colors.primary[500]}`,
  },
};

// Professional Layout Guidelines
export const layout = {
  // Maximum widths for content
  maxWidth: {
    sm: '640px',   // Small content
    md: '768px',   // Medium content  
    lg: '1024px',  // Large content
    xl: '1280px',  // Extra large content
    '2xl': '1536px', // Full width content
  },
  
  // Consistent spacing patterns
  section: {
    paddingY: spacing[16],      // 64px vertical padding
    paddingX: spacing[4],       // 16px horizontal padding
    marginY: spacing[20],       // 80px vertical margins
  },
  
  // Grid patterns
  grid: {
    cols1: 'grid-cols-1',
    cols2: 'grid-cols-1 md:grid-cols-2',
    cols3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    cols4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    gap: `gap-${spacing[6]}`, // 24px gap
  },
};

// Utility Functions
export const utils = {
  // Get professional color with opacity
  withOpacity: (color: string, opacity: number) => `${color}/${Math.round(opacity * 100)}`,
  
  // Professional focus ring
  focusRing: `focus:ring-2 focus:ring-${colors.primary[500]} focus:ring-offset-2`,
  
  // Professional hover transitions
  hoverTransition: 'transition-all duration-200 ease-in-out',
  
  // Professional animation presets
  animation: {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    scaleIn: 'animate-scale-in',
  },
};

// Export everything as default
export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  iconGuidelines,
  components,
  layout,
  utils,
};