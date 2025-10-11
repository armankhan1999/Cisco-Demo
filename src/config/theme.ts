/**
 * Theme Configuration
 * Professional color palette for enterprise applications
 */

export const colors = {
  // Primary Colors
  primary: {
    DEFAULT: '#049FD9', // Blue
    dark: '#0D274D',    // Dark Blue
    light: '#00BCEB',   // Light Blue
    hover: '#0385B5',   // Hover state
  },
  
  // Secondary Colors
  secondary: {
    teal: '#6CC04A',    // Teal/Green
    purple: '#7B5EA7',  // Purple
    orange: '#F58220',  // Orange
    red: '#ED1C24',     // Red
  },
  
  // Neutral Colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Semantic Colors
  success: '#6CC04A',
  warning: '#F58220',
  error: '#ED1C24',
  info: '#049FD9',
  
  // Background Colors
  background: {
    primary: '#FFFFFF',
    secondary: '#F9FAFB',
    dark: '#0D274D',
    sidebar: '#0D274D',
  },
  
  // Text Colors
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    tertiary: '#9CA3AF',
    light: '#FFFFFF',
    muted: '#9CA3AF',
  },
} as const;

/**
 * Persona-specific color schemes
 */
export const personaColors = {
  CSM: {
    primary: colors.primary.DEFAULT,
    accent: colors.secondary.teal,
    gradient: 'from-[#049FD9] to-[#6CC04A]',
  },
  CO: {
    primary: colors.secondary.purple,
    accent: colors.primary.light,
    gradient: 'from-[#7B5EA7] to-[#00BCEB]',
  },
  SE: {
    primary: colors.secondary.orange,
    accent: colors.primary.DEFAULT,
    gradient: 'from-[#F58220] to-[#049FD9]',
  },
  AI_CHAT: {
    primary: colors.primary.DEFAULT,
    accent: colors.secondary.purple,
    gradient: 'from-[#049FD9] to-[#7B5EA7]',
  },
} as const;

/**
 * Typography configuration
 */
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['Fira Code', 'monospace'],
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
} as const;

/**
 * Spacing configuration
 */
export const spacing = {
  sidebar: {
    width: '280px',
    collapsedWidth: '80px',
  },
  header: {
    height: '64px',
  },
  content: {
    padding: '24px',
  },
} as const;

/**
 * Animation configuration
 */
export const animations = {
  transition: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
} as const;
